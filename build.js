// Build script for Vercel deployment
const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy static files to public directory
const filesToCopy = [
    'index.html',
    'styles.css',
    'script.js',
    'quiz.js',
    'chatbot.js',
    'religion-knowledge.js',
    'article-generator.js'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(publicDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to public/`);
    }
});

// Copy api directory (keep it at root level for Vercel functions)
// Vercel functions should be in root/api, not public/api
const apiSrcDir = path.join(__dirname, 'api');
if (fs.existsSync(apiSrcDir)) {
    // Just verify api directory exists, don't copy it
    console.log('API directory found at root level (correct for Vercel)');
}

console.log('Build completed!');

