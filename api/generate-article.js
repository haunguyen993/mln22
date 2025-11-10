// Vercel Serverless Function for AI Article Generation
// This will work on Vercel deployment

export const config = {
    runtime: 'nodejs',
};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { topic, religion, customTopic, style, context } = req.body;

        // Option 1: Use OpenAI API (if API key is set)
        if (process.env.OPENAI_API_KEY) {
            return await generateWithOpenAI(req, res, { topic, religion, customTopic, style, context });
        }

        // Option 2: Use Hugging Face API (free tier available)
        if (process.env.HUGGINGFACE_API_KEY) {
            return await generateWithHuggingFace(req, res, { topic, religion, customTopic, style, context });
        }

        // Option 3: Use Anthropic Claude API
        if (process.env.ANTHROPIC_API_KEY) {
            return await generateWithAnthropic(req, res, { topic, religion, customTopic, style, context });
        }

        // Fallback: Enhanced rule-based generation
        return await generateWithEnhancedRules(req, res, { topic, religion, customTopic, style, context });

    } catch (error) {
        console.error('Error generating article:', error);
        return res.status(500).json({ 
            error: 'Failed to generate article',
            message: error.message 
        });
    }
}

// OpenAI Integration
async function generateWithOpenAI(req, res, { topic, religion, customTopic, style, context }) {
    try {
        const OpenAI = (await import('openai')).default;
        
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = buildPrompt(topic, religion, customTopic, style, context);

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
            messages: [
                {
                    role: 'system',
                    content: 'Bạn là một chuyên gia viết bài về tôn giáo. Viết bài viết chuyên sâu, chính xác và hấp dẫn bằng tiếng Việt. Sử dụng HTML để format (h2, h3, p, ul, li, strong).'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const article = completion.choices[0].message.content;

        return res.status(200).json({
            success: true,
            article: article,
            model: 'openai-gpt-3.5-turbo'
        });
    } catch (error) {
        console.error('OpenAI error:', error);
        throw error;
    }
}

// Hugging Face Integration (Free alternative)
async function generateWithHuggingFace(req, res, { topic, religion, customTopic, style, context }) {
    const prompt = buildPrompt(topic, religion, customTopic, style, context);

    // Using a Vietnamese language model from Hugging Face
    const response = await fetch(
        'https://api-inference.huggingface.co/models/vinai/phobert-base-v2',
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 1000,
                    temperature: 0.7,
                    do_sample: true,
                }
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Hugging Face API error');
    }

    const result = await response.json();
    
    // For text generation models, use a different endpoint
    // This is a placeholder - you'd need to use a text generation model
    return res.status(200).json({
        success: true,
        article: result[0]?.generated_text || 'Generated article',
        model: 'huggingface'
    });
}

// Anthropic Claude Integration
async function generateWithAnthropic(req, res, { topic, religion, customTopic, style, context }) {
    const Anthropic = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic.default({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = buildPrompt(topic, religion, customTopic, style, context);

    const message = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        system: 'Bạn là một chuyên gia viết bài về tôn giáo. Viết bài viết chuyên sâu, chính xác và hấp dẫn bằng tiếng Việt.'
    });

    const article = message.content[0].text;

    return res.status(200).json({
        success: true,
        article: article,
        model: 'anthropic-claude'
    });
}

// Enhanced Rule-based (Fallback)
async function generateWithEnhancedRules(req, res, { topic, religion, customTopic, style, context }) {
    // This will use the existing logic but enhanced
    // For now, return a message to set up API keys
    return res.status(200).json({
        success: true,
        article: 'Vui lòng cấu hình API key để sử dụng AI. Hiện đang sử dụng chế độ cơ bản.',
        model: 'rule-based',
        note: 'Để sử dụng AI thực sự, vui lòng thêm API key vào biến môi trường Vercel.'
    });
}

// Build prompt for AI
function buildPrompt(topic, religion, customTopic, style, context) {
    let prompt = '';

    // Style instructions
    const styleInstructions = {
        'informative': 'Viết theo phong cách thông tin, khách quan, dễ hiểu.',
        'academic': 'Viết theo phong cách học thuật, chuyên sâu, có phân tích và trích dẫn.',
        'narrative': 'Viết theo phong cách kể chuyện, sinh động, hấp dẫn, sử dụng hình ảnh và phép ẩn dụ.',
        'comparative': 'Viết theo phong cách so sánh, phân tích đối chiếu giữa các tôn giáo hoặc khái niệm.'
    };

    prompt += `Yêu cầu: ${styleInstructions[style] || styleInstructions['informative']}\n\n`;

    // Topic-specific instructions
    if (topic === 'religion' && religion) {
        prompt += `Viết một bài viết chuyên sâu về ${religion}. `;
        prompt += `Bao gồm: nguồn gốc, giáo lý chính, thực hành, kinh sách, các nhánh, và ảnh hưởng. `;
        prompt += `Sử dụng thông tin từ knowledge base nếu có.\n\n`;
    } else if (topic === 'comparison') {
        prompt += `Viết một bài viết so sánh các tôn giáo lớn trên thế giới. `;
        prompt += `Bao gồm bảng so sánh, điểm tương đồng và khác biệt.\n\n`;
    } else if (topic === 'custom' && customTopic) {
        prompt += `Viết một bài viết về chủ đề: "${customTopic}". `;
        prompt += `Phân tích sâu sắc và toàn diện về chủ đề này.\n\n`;
    } else {
        prompt += `Viết một bài viết về chủ đề tôn giáo: ${topic}.\n\n`;
    }

    // Add context if provided
    if (context) {
        prompt += `Ngữ cảnh bổ sung: ${context}\n\n`;
    }

    prompt += `Yêu cầu:\n`;
    prompt += `- Viết bằng tiếng Việt\n`;
    prompt += `- Sử dụng HTML để format (h2, h3, p, ul, li, strong)\n`;
    prompt += `- Bài viết phải chính xác, có cấu trúc rõ ràng\n`;
    prompt += `- Bao gồm phần giới thiệu, nội dung chính, và kết luận\n`;

    return prompt;
}

