// Vercel Serverless Function for AI Chatbot
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
        const { message, chatHistory, context } = req.body;

        // Option 1: Use OpenAI API (if API key is set)
        if (process.env.OPENAI_API_KEY) {
            return await chatWithOpenAI(req, res, { message, chatHistory, context });
        }

        // Option 2: Use Anthropic Claude API
        if (process.env.ANTHROPIC_API_KEY) {
            return await chatWithAnthropic(req, res, { message, chatHistory, context });
        }

        // Option 3: Use Hugging Face API (free tier available)
        if (process.env.HUGGINGFACE_API_KEY) {
            return await chatWithHuggingFace(req, res, { message, chatHistory, context });
        }

        // Fallback: Return null to use rule-based
        return res.status(200).json({
            success: false,
            useFallback: true,
            message: 'API key not configured. Using rule-based responses.'
        });

    } catch (error) {
        console.error('Error in chatbot API:', error);
        return res.status(500).json({ 
            error: 'Failed to process message',
            message: error.message,
            useFallback: true
        });
    }
}

// OpenAI Integration
async function chatWithOpenAI(req, res, { message, chatHistory, context }) {
    try {
        const OpenAI = (await import('openai')).default;
        
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Build system message with context
        let systemMessage = `Bạn là một AI trợ lý thông minh và hữu ích. Bạn có kiến thức rộng về nhiều lĩnh vực:
- Tôn giáo trên thế giới (Phật giáo, Công giáo, Hồi giáo, Ấn Độ giáo, Do Thái giáo, Đạo Sikh, Đạo giáo, Nho giáo, Chính Thống giáo, Tin Lành)
- Chính sách tôn giáo của Việt Nam
- Lịch sử, văn hóa, khoa học, công nghệ
- Và nhiều chủ đề khác

Bạn trả lời bằng tiếng Việt, rõ ràng, chính xác và hữu ích. Nếu không biết câu trả lời, hãy nói thật và đề xuất nguồn thông tin khác.`;

        if (context && context.religionKnowledge) {
            systemMessage += `\n\nBạn có quyền truy cập vào knowledge base về tôn giáo để cung cấp thông tin chính xác.`;
        }

        // Build messages array
        const messages = [
            {
                role: 'system',
                content: systemMessage
            }
        ];

        // Add chat history (last 10 messages for context)
        if (chatHistory && Array.isArray(chatHistory)) {
            const recentHistory = chatHistory.slice(-10);
            recentHistory.forEach(msg => {
                if (msg.role && msg.content) {
                    messages.push({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    });
                }
            });
        }

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000,
        });

        const response = completion.choices[0].message.content;

        return res.status(200).json({
            success: true,
            response: response,
            model: 'openai-gpt-3.5-turbo'
        });
    } catch (error) {
        console.error('OpenAI error:', error);
        throw error;
    }
}

// Anthropic Claude Integration
async function chatWithAnthropic(req, res, { message, chatHistory, context }) {
    try {
        const Anthropic = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic.default({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // Build system message
        let systemMessage = `Bạn là một AI trợ lý thông minh và hữu ích. Bạn có kiến thức rộng về nhiều lĩnh vực:
- Tôn giáo trên thế giới (Phật giáo, Công giáo, Hồi giáo, Ấn Độ giáo, Do Thái giáo, Đạo Sikh, Đạo giáo, Nho giáo, Chính Thống giáo, Tin Lành)
- Chính sách tôn giáo của Việt Nam
- Lịch sử, văn hóa, khoa học, công nghệ
- Và nhiều chủ đề khác

Bạn trả lời bằng tiếng Việt, rõ ràng, chính xác và hữu ích. Nếu không biết câu trả lời, hãy nói thật và đề xuất nguồn thông tin khác.`;

        // Build messages array
        const messages = [];

        // Add chat history (last 10 messages for context)
        if (chatHistory && Array.isArray(chatHistory)) {
            const recentHistory = chatHistory.slice(-10);
            recentHistory.forEach(msg => {
                if (msg.role && msg.content) {
                    messages.push({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    });
                }
            });
        }

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        const response = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            messages: messages,
            system: systemMessage
        });

        const responseText = response.content[0].text;

        return res.status(200).json({
            success: true,
            response: responseText,
            model: 'anthropic-claude'
        });
    } catch (error) {
        console.error('Anthropic error:', error);
        throw error;
    }
}

// Hugging Face Integration (Free alternative)
async function chatWithHuggingFace(req, res, { message, chatHistory, context }) {
    // Note: Hugging Face chat models may have different API structure
    // This is a placeholder - you may need to adjust based on the specific model
    try {
        const response = await fetch(
            'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: {
                        past_user_inputs: chatHistory?.filter(m => m.role === 'user').slice(-5).map(m => m.content) || [],
                        generated_responses: chatHistory?.filter(m => m.role === 'bot').slice(-5).map(m => m.content) || [],
                        text: message
                    }
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Hugging Face API error');
        }

        const result = await response.json();
        
        return res.status(200).json({
            success: true,
            response: result.generated_text || 'Xin lỗi, tôi không thể trả lời câu hỏi này.',
            model: 'huggingface'
        });
    } catch (error) {
        console.error('Hugging Face error:', error);
        throw error;
    }
}

