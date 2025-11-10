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

// Copy image directory to public/image
const imageSrcDir = path.join(__dirname, 'image');
const imageDestDir = path.join(publicDir, 'image');

if (fs.existsSync(imageSrcDir)) {
    if (!fs.existsSync(imageDestDir)) {
        fs.mkdirSync(imageDestDir, { recursive: true });
    }
    
    const imageFiles = fs.readdirSync(imageSrcDir);
    imageFiles.forEach(file => {
        const srcPath = path.join(imageSrcDir, file);
        const destPath = path.join(imageDestDir, file);
        
        // Check if it's a file (not a directory)
        if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied image/${file} to public/image/`);
        }
    });
    console.log(`Copied ${imageFiles.length} image files to public/image/`);
} else {
    console.log('Warning: image directory not found');
}

// Copy api directory (keep it at root level for Vercel functions)
// Vercel functions should be in root/api, not public/api
const apiSrcDir = path.join(__dirname, 'api');
if (fs.existsSync(apiSrcDir)) {
    // Just verify api directory exists, don't copy it
    console.log('API directory found at root level (correct for Vercel)');
}

console.log('Build completed!');

