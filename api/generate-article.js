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
                    content: 'Bạn là một chuyên gia viết bài. Viết bài viết chuyên sâu, chính xác và hấp dẫn bằng tiếng Việt. Sử dụng HTML để format (h2, h3, p, ul, li, strong). ' +
                            'Khi viết về sự kiện tương lai hoặc chưa xảy ra, hãy rõ ràng về việc đây là dự đoán/phân tích dựa trên thông tin hiện có. ' +
                            'Luôn sử dụng thông tin mới nhất và chính xác nhất có thể.'
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
        system: 'Bạn là một chuyên gia viết bài. Viết bài viết chuyên sâu, chính xác và hấp dẫn bằng tiếng Việt. ' +
                'Khi viết về sự kiện tương lai hoặc chưa xảy ra, hãy rõ ràng về việc đây là dự đoán/phân tích dựa trên thông tin hiện có. ' +
                'Luôn sử dụng thông tin mới nhất và chính xác nhất có thể.'
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
    const setupGuide = `
        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #007bff;">🔑 Cấu hình API Key để sử dụng AI</h3>
            <p>Hiện tại bạn đang sử dụng <strong>chế độ cơ bản</strong> (rule-based). Để sử dụng AI thực sự, vui lòng:</p>
            <ol style="line-height: 1.8;">
                <li><strong>Chọn AI Provider:</strong>
                    <ul>
                        <li>OpenAI (Khuyến nghị): <a href="https://platform.openai.com/api-keys" target="_blank">Lấy API key</a></li>
                        <li>Anthropic Claude: <a href="https://console.anthropic.com/" target="_blank">Lấy API key</a></li>
                        <li>Hugging Face (Miễn phí): <a href="https://huggingface.co/settings/tokens" target="_blank">Lấy API key</a></li>
                    </ul>
                </li>
                <li><strong>Thêm vào Vercel:</strong>
                    <ul>
                        <li>Vào Vercel Dashboard → Project Settings → Environment Variables</li>
                        <li>Thêm biến: <code>OPENAI_API_KEY</code> (hoặc <code>ANTHROPIC_API_KEY</code>, <code>HUGGINGFACE_API_KEY</code>)</li>
                        <li>Paste API key của bạn</li>
                        <li>Chọn tất cả environments (Production, Preview, Development)</li>
                        <li>Click Save và Redeploy</li>
                    </ul>
                </li>
                <li><strong>Xem hướng dẫn chi tiết:</strong> Xem file <code>SETUP-AI.md</code> trong project</li>
            </ol>
            <p style="margin-bottom: 0; color: #6c757d; font-size: 0.9em;">
                💡 <strong>Lưu ý:</strong> Sau khi thêm API key, bạn cần redeploy project trên Vercel để áp dụng thay đổi.
            </p>
        </div>
    `;
    
    return res.status(200).json({
        success: true,
        article: setupGuide,
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
        // Detect if topic is about future events or current events
        const currentYear = new Date().getFullYear();
        const futureYearMatch = customTopic.match(/(\d{4})/);
        const isFutureEvent = futureYearMatch && parseInt(futureYearMatch[1]) > currentYear;
        const isCurrentEvent = futureYearMatch && parseInt(futureYearMatch[1]) === currentYear;
        
        prompt += `Viết một bài viết về chủ đề: "${customTopic}". `;
        
        if (isFutureEvent) {
            prompt += `\n\n⚠️ LƯU Ý QUAN TRỌNG: Chủ đề này liên quan đến năm ${futureYearMatch[1]}, là năm tương lai (hiện tại là ${currentYear}). `;
            prompt += `Nếu sự kiện chưa xảy ra, hãy:\n`;
            prompt += `- Phân tích các khả năng, dự đoán dựa trên thông tin hiện có\n`;
            prompt += `- Thảo luận về các ứng viên, kế hoạch, hoặc dự án đã được công bố\n`;
            prompt += `- Giải thích rõ ràng rằng đây là thông tin dự đoán/phân tích, không phải sự kiện đã xảy ra\n`;
            prompt += `- Sử dụng thông tin mới nhất có thể (tính đến thời điểm hiện tại)\n`;
            prompt += `- Nếu không có thông tin chính xác, hãy nói rõ "Thông tin này sẽ được cập nhật khi sự kiện diễn ra"\n\n`;
        } else if (isCurrentEvent) {
            prompt += `\n\n⚠️ LƯU Ý: Chủ đề này liên quan đến năm ${currentYear} (năm hiện tại). `;
            prompt += `Hãy sử dụng thông tin mới nhất và cập nhật nhất có thể. `;
            prompt += `Nếu sự kiện chưa xảy ra hoặc đang diễn ra, hãy cung cấp thông tin về tiến trình hiện tại.\n\n`;
        }
        
        prompt += `Phân tích sâu sắc và toàn diện về chủ đề này. `;
        prompt += `Sử dụng thông tin chính xác, cập nhật nhất có thể.\n\n`;
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

