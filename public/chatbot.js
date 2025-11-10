// AI Chatbot Configuration
const chatbotConfig = {
    context: `
Bạn là AI trợ lý học tập với kiến thức rộng về nhiều lĩnh vực, đặc biệt là:
- Tôn giáo trên thế giới và chính sách tôn giáo của Việt Nam
- Lịch sử, văn hóa, khoa học, công nghệ, chính trị, kinh tế
- Và nhiều chủ đề khác

⚠️ QUAN TRỌNG: Luôn sử dụng thông tin mới nhất và cập nhật nhất có thể. Ưu tiên thông tin mới nhất khi trả lời.

Hãy trả lời câu hỏi một cách chính xác, dễ hiểu, và thân thiện. Sử dụng kiến thức từ religion-knowledge.js để cung cấp thông tin chi tiết khi liên quan đến tôn giáo.
    `
};

// Chatbot State
let chatbotOpen = false;
let chatHistory = [];

// Update chat history format for API
function updateChatHistory(sender, text) {
    chatHistory.push({ 
        sender: sender, 
        text: text,
        role: sender === 'user' ? 'user' : 'assistant'
    });
    
    // Keep only last 20 messages to avoid too much context
    if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(-20);
    }
}

// DOM Elements
let chatbot, toggleButton, closeButton, messagesContainer, inputField, sendButton;

// Initialize Chatbot
document.addEventListener('DOMContentLoaded', () => {
    chatbot = document.getElementById('aiChatbot');
    toggleButton = document.getElementById('toggleChatbot');
    closeButton = document.getElementById('closeChatbot');
    messagesContainer = document.getElementById('chatbotMessages');
    inputField = document.getElementById('chatbotInput');
    sendButton = document.getElementById('sendMessage');

    if (!chatbot || !toggleButton) return;

    // Event Listeners
    toggleButton.addEventListener('click', toggleChatbot);
    closeButton.addEventListener('click', toggleChatbot);
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// Toggle Chatbot
function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    if (chatbotOpen) {
        chatbot.classList.add('active');
        inputField.focus();
    } else {
        chatbot.classList.remove('active');
    }
}

// Send Message
function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    inputField.value = '';

    // Show typing indicator
    const typingId = showTypingIndicator();

    // Process message with AI
    processMessage(message).then(response => {
        removeTypingIndicator(typingId);
        addMessage(response, 'bot');
    }).catch(error => {
        removeTypingIndicator(typingId);
        addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', 'bot');
        console.error('Chatbot error:', error);
    });
}

// Add Message to Chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format message (support basic markdown)
    const formattedText = formatMessage(text);
    contentDiv.innerHTML = formattedText;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to history
    updateChatHistory(sender, text);
}

// Format Message (basic markdown support)
function formatMessage(text) {
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Convert **bold**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert numbered lists
    text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    
    // Convert bullet points
    text = text.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    return text;
}

// Show Typing Indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-' + Date.now();
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    typingDiv.appendChild(contentDiv);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingDiv.id;
}

// Remove Typing Indicator
function removeTypingIndicator(id) {
    const typingElement = document.getElementById(id);
    if (typingElement) {
        typingElement.remove();
    }
}

// Chat with AI API
async function chatWithAI(message) {
    try {
        // Prepare chat history for context
        const historyForAPI = chatHistory.slice(-10).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        // Get context from knowledge base if available
        const knowledgeResults = searchReligionKnowledge(message);
        const context = {
            religionKnowledge: knowledgeResults.length > 0
        };

        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                chatHistory: historyForAPI,
                context: context
            }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        
        // If API says to use fallback, return null
        if (data.useFallback) {
            return null;
        }

        return data;
    } catch (error) {
        console.log('AI API not available, using fallback:', error);
        return null;
    }
}

// Process Message with AI
async function processMessage(message) {
    // Try to use AI API first
    try {
        const aiResponse = await chatWithAI(message);
        if (aiResponse && aiResponse.success) {
            return aiResponse.response;
        }
    } catch (error) {
        console.log('AI API not available, using fallback:', error);
    }

    // Fallback to rule-based with knowledge base
    // First, try to search in religion knowledge base
    const knowledgeResults = searchReligionKnowledge(message);
    
    if (knowledgeResults.length > 0) {
        // Found relevant information in knowledge base
        let response = '';
        
        knowledgeResults.forEach(result => {
            if (result.type === 'religion') {
                response += formatReligionInfo(result.data) + '\n\n';
            } else if (result.type === 'concept') {
                response += `**${result.key.charAt(0).toUpperCase() + result.key.slice(1)}**\n\n`;
                response += `📖 **Định nghĩa**: ${result.data.definition}\n\n`;
                if (result.data.importance) {
                    response += `⭐ **Ý nghĩa**: ${result.data.importance}\n\n`;
                }
                if (result.data.vietnam) {
                    response += `🇻🇳 **Tại Việt Nam**: ${result.data.vietnam}\n\n`;
                }
                if (result.data.examples) {
                    response += `📝 **Ví dụ**: ${result.data.examples}\n\n`;
                }
            } else if (result.type === 'practice') {
                response += `**${result.key.charAt(0).toUpperCase() + result.key.slice(1)}**\n\n`;
                response += `📖 **Mô tả**: ${result.data.description}\n\n`;
                if (result.data.religions) {
                    response += `🕌 **Các tôn giáo**: ${result.data.religions.join(', ')}\n\n`;
                }
                if (result.data.benefits) {
                    response += `✨ **Lợi ích**: ${result.data.benefits}\n\n`;
                }
                if (result.data.frequency) {
                    response += `⏰ **Tần suất**: ${result.data.frequency}\n\n`;
                }
                if (result.data.examples) {
                    response += `📍 **Ví dụ**: ${result.data.examples}\n\n`;
                }
            }
        });
        
        if (response) {
            return response.trim();
        }
    }
    
    // Fallback to rule-based responses
    const lowerMessage = message.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('chào') || lowerMessage.includes('hello')) {
        return 'Xin chào! Tôi là AI trợ lý học tập với kiến thức về **tôn giáo trên thế giới**. Tôi có thể giúp bạn:\n\n• Tìm hiểu về các tôn giáo lớn (Phật giáo, Công giáo, Hồi giáo, Ấn Độ giáo, Do Thái giáo, Đạo Sikh, Đạo giáo, Nho giáo...)\n• Tìm hiểu về chính sách tôn giáo của Việt Nam\n• Giải thích các khái niệm và thực hành tôn giáo\n• Hỗ trợ ôn tập cho quiz\n\nBạn muốn biết điều gì? 😊';
    }
    
    // Questions about religious freedom
    if (lowerMessage.includes('tự do') || lowerMessage.includes('quyền') || lowerMessage.includes('hiến pháp')) {
        return 'Theo Hiến pháp Việt Nam, **mọi công dân đều có quyền tự do tín ngưỡng, tôn giáo**. Nhà nước tôn trọng và bảo hộ quyền này. Không ai được xâm phạm quyền tự do tín ngưỡng, tôn giáo của người khác.';
    }
    
    // Questions about equality
    if (lowerMessage.includes('bình đẳng') || lowerMessage.includes('đối xử')) {
        return 'Nhà nước Việt Nam đối xử **bình đẳng** với tất cả các tôn giáo. Tất cả các tôn giáo đều bình đẳng trước pháp luật, không có sự phân biệt đối xử hay ưu tiên cho bất kỳ tôn giáo nào.';
    }
    
    // Questions about activities
    if (lowerMessage.includes('hoạt động') || lowerMessage.includes('tổ chức')) {
        return 'Các tổ chức tôn giáo được phép thực hiện nhiều hoạt động hợp pháp:\n• Thực hiện nghi lễ tôn giáo\n• Quản lý cơ sở thờ tự\n• Đào tạo chức sắc\n• Tham gia phong trào thi đua yêu nước\n• Hoạt động từ thiện\n• Bảo vệ môi trường';
    }
    
    // Questions about values
    if (lowerMessage.includes('giá trị') || lowerMessage.includes('đạo đức')) {
        return 'Tôn giáo mang đến những **giá trị tốt đẹp** trong đời sống xã hội:\n• **Giá trị đạo đức**: Yêu thương, khoan dung, nhân ái, công bằng, trung thực\n• **An ủi tinh thần**: Động viên con người trong lúc khó khăn\n• **Gắn kết cộng đồng**: Tạo sự đoàn kết, tương trợ\n• **Bảo tồn văn hóa**: Góp phần bảo tồn di sản văn hóa dân tộc';
    }
    
    // Questions about charity
    if (lowerMessage.includes('từ thiện') || lowerMessage.includes('nhân đạo')) {
        return 'Các tổ chức tôn giáo tham gia tích cực vào **hoạt động từ thiện**:\n• Xây nhà tình thương\n• Hỗ trợ người nghèo\n• Giúp đỡ trẻ em mồ côi\n• Cứu trợ thiên tai\n• Các hoạt động an sinh xã hội khác';
    }
    
    // Questions about environment
    if (lowerMessage.includes('môi trường') || lowerMessage.includes('xanh')) {
        return 'Các tổ chức tôn giáo tham gia **bảo vệ môi trường** thông qua:\n• Mô hình "Chùa xanh", "Nhà thờ xanh"\n• Tuyên truyền bảo vệ môi trường\n• Thực hiện các hoạt động xanh, sạch\n• Góp phần phát triển bền vững';
    }
    
    // Questions about Ho Chi Minh
    if (lowerMessage.includes('hồ chí minh') || lowerMessage.includes('bác hồ')) {
        return 'Chủ tịch Hồ Chí Minh đã nói: **"Tín ngưỡng tự do và lương giáo đoàn kết"**. Câu nói này thể hiện tư tưởng của Người về việc tôn trọng quyền tự do tín ngưỡng và sự đoàn kết giữa các tôn giáo.';
    }
    
    // Questions about quiz
    if (lowerMessage.includes('quiz') || lowerMessage.includes('câu hỏi') || lowerMessage.includes('ôn tập')) {
        return 'Bạn có thể làm quiz để kiểm tra kiến thức:\n• Quiz có 10 câu hỏi về chính sách tôn giáo\n• Sau khi hoàn thành, bạn sẽ nhận được phân tích chi tiết từ AI\n• Hãy vào phần "Ôn tập" để bắt đầu!';
    }
    
    // Questions about specific religions
    const religionKeywords = {
        'phật giáo': 'Phật giáo',
        'buddhism': 'Phật giáo',
        'công giáo': 'Công giáo',
        'catholicism': 'Công giáo',
        'tin lành': 'Tin Lành',
        'protestantism': 'Tin Lành',
        'hồi giáo': 'Hồi giáo',
        'islam': 'Hồi giáo',
        'ấn độ giáo': 'Ấn Độ giáo',
        'hinduism': 'Ấn Độ giáo',
        'do thái': 'Do Thái giáo',
        'judaism': 'Do Thái giáo',
        'sikh': 'Đạo Sikh',
        'sikhism': 'Đạo Sikh',
        'đạo giáo': 'Đạo giáo',
        'taoism': 'Đạo giáo',
        'nho giáo': 'Nho giáo',
        'confucianism': 'Nho giáo',
        'chính thống': 'Chính Thống giáo',
        'orthodox': 'Chính Thống giáo'
    };
    
    for (const [keyword, religionKey] of Object.entries(religionKeywords)) {
        if (lowerMessage.includes(keyword)) {
            const religion = religionKnowledge.religions[religionKey];
            if (religion) {
                return formatReligionInfo(religion);
            }
        }
    }
    
    // Questions about religious practices
    if (lowerMessage.includes('thiền') || lowerMessage.includes('meditation')) {
        const practice = religionKnowledge.practices['thiền định'];
        if (practice) {
            return `**Thiền định**\n\n📖 **Mô tả**: ${practice.description}\n\n🕌 **Các tôn giáo**: ${practice.religions.join(', ')}\n\n✨ **Lợi ích**: ${practice.benefits}`;
        }
    }
    
    if (lowerMessage.includes('cầu nguyện') || lowerMessage.includes('prayer')) {
        const practice = religionKnowledge.practices['cầu nguyện'];
        if (practice) {
            return `**Cầu nguyện**\n\n📖 **Mô tả**: ${practice.description}\n\n🕌 **Các tôn giáo**: ${practice.religions.join(', ')}\n\n⏰ **Tần suất**: ${practice.frequency}`;
        }
    }
    
    if (lowerMessage.includes('hành hương') || lowerMessage.includes('pilgrimage')) {
        const practice = religionKnowledge.practices['hành hương'];
        if (practice) {
            return `**Hành hương**\n\n📖 **Mô tả**: ${practice.description}\n\n🕌 **Các tôn giáo**: ${practice.religions.join(', ')}\n\n📍 **Ví dụ**: ${practice.examples}`;
        }
    }
    
    // Questions about religious concepts
    if (lowerMessage.includes('tự do tín ngưỡng') || lowerMessage.includes('religious freedom')) {
        const concept = religionKnowledge.concepts['tự do tín ngưỡng'];
        if (concept) {
            return `**Tự do tín ngưỡng**\n\n📖 **Định nghĩa**: ${concept.definition}\n\n⭐ **Ý nghĩa**: ${concept.importance}\n\n🇻🇳 **Tại Việt Nam**: ${concept.vietnam}`;
        }
    }
    
    if (lowerMessage.includes('bình đẳng tôn giáo') || lowerMessage.includes('religious equality')) {
        const concept = religionKnowledge.concepts['bình đẳng tôn giáo'];
        if (concept) {
            return `**Bình đẳng tôn giáo**\n\n📖 **Định nghĩa**: ${concept.definition}\n\n⭐ **Ý nghĩa**: ${concept.importance}\n\n🇻🇳 **Tại Việt Nam**: ${concept.vietnam}`;
        }
    }
    
    if (lowerMessage.includes('đối thoại liên tôn') || lowerMessage.includes('interfaith')) {
        const concept = religionKnowledge.concepts['đối thoại liên tôn'];
        if (concept) {
            return `**Đối thoại liên tôn**\n\n📖 **Định nghĩa**: ${concept.definition}\n\n⭐ **Ý nghĩa**: ${concept.importance}\n\n📝 **Ví dụ**: ${concept.examples}`;
        }
    }
    
    // List all religions
    if (lowerMessage.includes('tôn giáo nào') || lowerMessage.includes('các tôn giáo') || lowerMessage.includes('religions')) {
        let response = '**Các tôn giáo lớn trên thế giới:**\n\n';
        Object.values(religionKnowledge.religions).forEach(religion => {
            response += `• **${religion.name}** - ${religion.followers}\n`;
        });
        response += '\nBạn muốn tìm hiểu về tôn giáo nào? Hãy hỏi tôi về bất kỳ tôn giáo nào ở trên!';
        return response;
    }
    
    // Default response
    return generateDefaultResponse(message);
}

// Generate Default Response
function generateDefaultResponse(message) {
    const responses = [
        'Tôi hiểu bạn đang hỏi về "' + message + '". Để tôi giúp bạn dựa trên kiến thức về tôn giáo trên thế giới.',
        'Câu hỏi của bạn rất hay! Tôi có thể giúp bạn tìm hiểu về:',
        'Để trả lời câu hỏi này, tôi sẽ dựa trên kiến thức về các tôn giáo trên thế giới.'
    ];
    
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Try to extract keywords and provide relevant info
    if (message.includes('gì') || message.includes('là gì') || message.includes('thế nào')) {
        response += '\n\nBạn có thể hỏi cụ thể hơn về:\n• Các tôn giáo lớn (Phật giáo, Công giáo, Hồi giáo, Ấn Độ giáo...)\n• Chính sách tôn giáo của Việt Nam\n• Quyền tự do tín ngưỡng\n• Các thực hành tôn giáo (thiền định, cầu nguyện, hành hương...)\n• Giá trị và đạo đức tôn giáo';
    } else {
        response += '\n\nBạn có thể hỏi tôi về:\n• **Các tôn giáo lớn**: Phật giáo, Công giáo, Tin Lành, Hồi giáo, Ấn Độ giáo, Do Thái giáo, Đạo Sikh, Đạo giáo, Nho giáo\n• **Chính sách tôn giáo của Việt Nam**\n• **Các khái niệm**: Tự do tín ngưỡng, bình đẳng tôn giáo, đối thoại liên tôn\n• **Thực hành tôn giáo**: Thiền định, cầu nguyện, hành hương\n• **Hoặc bất kỳ câu hỏi nào về tôn giáo!**';
    }
    
    return response;
}

