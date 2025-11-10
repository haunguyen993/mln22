// Quiz Questions Data
const quizQuestions = [
    {
        question: "Theo Hiến pháp Việt Nam, quyền tự do tín ngưỡng, tôn giáo được quy định như thế nào?",
        options: [
            "Mọi công dân đều có quyền tự do tín ngưỡng, tôn giáo",
            "Chỉ một số tôn giáo được công nhận",
            "Tôn giáo bị hạn chế trong hoạt động",
            "Chỉ người lớn mới có quyền tự do tín ngưỡng"
        ],
        correct: 0
    },
    {
        question: "Nhà nước Việt Nam đối xử với các tôn giáo như thế nào?",
        options: [
            "Phân biệt đối xử giữa các tôn giáo",
            "Tất cả các tôn giáo đều bình đẳng trước pháp luật",
            "Ưu tiên một số tôn giáo nhất định",
            "Hạn chế hoạt động của tôn giáo"
        ],
        correct: 1
    },
    {
        question: "Các tổ chức tôn giáo được phép thực hiện những hoạt động nào?",
        options: [
            "Chỉ thực hiện nghi lễ tôn giáo",
            "Thực hiện nghi lễ, quản lý cơ sở thờ tự, đào tạo chức sắc theo pháp luật",
            "Không được hoạt động công khai",
            "Chỉ hoạt động trong phạm vi hẹp"
        ],
        correct: 1
    },
    {
        question: "Giá trị nào sau đây KHÔNG phải là giá trị đạo đức mà tôn giáo hướng con người đến?",
        options: [
            "Yêu thương",
            "Khoan dung",
            "Tham lam",
            "Công bằng"
        ],
        correct: 2
    },
    {
        question: "Tôn giáo góp phần gì trong việc bảo tồn văn hóa?",
        options: [
            "Không có vai trò gì",
            "Bảo tồn và phát huy các giá trị văn hóa truyền thống của dân tộc",
            "Chỉ bảo tồn kiến trúc",
            "Chỉ bảo tồn nghệ thuật"
        ],
        correct: 1
    },
    {
        question: "Các tổ chức tôn giáo tham gia vào phong trào thi đua yêu nước nào?",
        options: [
            "Chỉ tham gia một số phong trào",
            "Không tham gia phong trào nào",
            "Tích cực tham gia các phong trào như 'Toàn dân đoàn kết xây dựng đời sống văn hóa', 'Xây dựng nông thôn mới'",
            "Chỉ tham gia hoạt động từ thiện"
        ],
        correct: 2
    },
    {
        question: "Hoạt động từ thiện của các tổ chức tôn giáo bao gồm những gì?",
        options: [
            "Chỉ xây nhà tình thương",
            "Xây nhà tình thương, hỗ trợ người nghèo, trẻ em mồ côi, cứu trợ thiên tai",
            "Chỉ cứu trợ thiên tai",
            "Không có hoạt động từ thiện"
        ],
        correct: 1
    },
    {
        question: "Mô hình 'Chùa xanh', 'Nhà thờ xanh' thể hiện điều gì?",
        options: [
            "Sự tham gia của tôn giáo vào bảo vệ môi trường",
            "Chỉ là tên gọi",
            "Không có ý nghĩa gì",
            "Chỉ là mô hình kiến trúc"
        ],
        correct: 0
    },
    {
        question: "Tôn giáo góp phần gì trong việc tăng cường đoàn kết dân tộc?",
        options: [
            "Không có vai trò gì",
            "Góp phần xây dựng khối đại đoàn kết toàn dân, thúc đẩy hòa giải, hòa hợp dân tộc",
            "Chỉ tạo sự chia rẽ",
            "Chỉ hoạt động độc lập"
        ],
        correct: 1
    },
    {
        question: "Câu nói 'Tín ngưỡng tự do và lương giáo đoàn kết' là của ai?",
        options: [
            "Tổng Bí thư",
            "Chủ tịch Hồ Chí Minh",
            "Thủ tướng",
            "Bộ trưởng"
        ],
        correct: 1
    }
];

// Quiz State
let currentQuestion = 0;
let userAnswers = [];
let quizStarted = false;

// DOM Elements - will be initialized after DOM loads
let quizIntro, quizContent, quizQuestionsContainer, quizResults;
let startQuizBtn, nextQuestionBtn, prevQuestionBtn, submitQuizBtn, retakeQuizBtn;
let progressFill, progressText;

// Initialize Quiz
function initQuiz() {
    userAnswers = new Array(quizQuestions.length).fill(null);
    currentQuestion = 0;
    quizStarted = true;
    renderQuestion();
    updateProgress();
    updateButtons();
}

// Render Question
function renderQuestion() {
    const question = quizQuestions[currentQuestion];
    const questionHTML = `
        <div class="question-card" data-question="${currentQuestion}">
            <h3 class="question-title">Câu ${currentQuestion + 1}: ${question.question}</h3>
            <div class="options-list">
                ${question.options.map((option, index) => `
                    <label class="option-item ${userAnswers[currentQuestion] === index ? 'selected' : ''}">
                        <input type="radio" 
                               name="question-${currentQuestion}" 
                               value="${index}" 
                               ${userAnswers[currentQuestion] === index ? 'checked' : ''}
                               onchange="selectAnswer(${currentQuestion}, ${index})">
                        <span class="option-text">${option}</span>
                        <span class="option-check"></span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    quizQuestionsContainer.innerHTML = questionHTML;
}

// Select Answer
function selectAnswer(questionIndex, answerIndex) {
    userAnswers[questionIndex] = answerIndex;
    renderQuestion();
    updateButtons();
}

// Update Progress
function updateProgress() {
    if (!progressFill || !progressText) return;
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `Câu ${currentQuestion + 1} / ${quizQuestions.length}`;
}

// Update Buttons
function updateButtons() {
    if (!prevQuestionBtn || !nextQuestionBtn || !submitQuizBtn) return;
    prevQuestionBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
    nextQuestionBtn.style.display = currentQuestion === quizQuestions.length - 1 ? 'none' : 'inline-block';
    submitQuizBtn.style.display = currentQuestion === quizQuestions.length - 1 ? 'inline-block' : 'none';
}

// Next Question
function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuestion();
        updateProgress();
        updateButtons();
        scrollToQuestion();
    }
}

// Previous Question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
        updateProgress();
        updateButtons();
        scrollToQuestion();
    }
}

// Scroll to Question
function scrollToQuestion() {
    const questionCard = document.querySelector('.question-card');
    if (questionCard) {
        questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Calculate Score
function calculateScore() {
    let correct = 0;
    let wrong = 0;
    
    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correct++;
        } else if (userAnswers[index] !== null) {
            wrong++;
        }
    });
    
    return { correct, wrong, total: quizQuestions.length };
}

// Show Results with AI Analysis
function showResults() {
    const score = calculateScore();
    const percentage = Math.round((score.correct / score.total) * 100);
    
    document.getElementById('finalScore').textContent = score.correct;
    document.getElementById('correctAnswers').textContent = score.correct;
    document.getElementById('wrongAnswers').textContent = score.wrong;
    document.getElementById('scorePercentage').textContent = percentage + '%';
    
    // AI Analysis
    const aiAnalysis = generateAIAnalysis(score, userAnswers);
    
    // Results Message
    let message = '';
    if (percentage >= 90) {
        message = 'Xuất sắc! Bạn đã nắm vững kiến thức về chính sách tôn giáo của Việt Nam.';
    } else if (percentage >= 70) {
        message = 'Tốt! Bạn đã hiểu rõ về chính sách tôn giáo. Hãy tiếp tục củng cố kiến thức.';
    } else if (percentage >= 50) {
        message = 'Khá! Bạn đã có kiến thức cơ bản. Hãy đọc lại nội dung để nắm vững hơn.';
    } else {
        message = 'Cần cố gắng thêm! Hãy đọc lại các phần nội dung để hiểu rõ hơn về chính sách tôn giáo.';
    }
    
    document.getElementById('resultsMessage').textContent = message;
    
    // Add AI Analysis to results
    const aiAnalysisDiv = document.getElementById('aiAnalysis');
    if (aiAnalysisDiv) {
        aiAnalysisDiv.innerHTML = aiAnalysis;
    }
    
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Generate AI Analysis
function generateAIAnalysis(score, answers) {
    const wrongQuestions = [];
    const correctQuestions = [];
    
    quizQuestions.forEach((question, index) => {
        if (answers[index] === question.correct) {
            correctQuestions.push({ index, question });
        } else if (answers[index] !== null) {
            wrongQuestions.push({ index, question, userAnswer: answers[index] });
        }
    });
    
    let analysisHTML = '<div class="ai-analysis-section">';
    analysisHTML += '<h4>📊 Phân tích chi tiết từ AI</h4>';
    
    // Overall Analysis
    analysisHTML += '<div class="analysis-overview">';
    analysisHTML += '<h5>Tổng quan:</h5>';
    if (score.correct === score.total) {
        analysisHTML += '<p>🎉 Hoàn hảo! Bạn đã trả lời đúng tất cả các câu hỏi. Bạn có kiến thức vững chắc về chính sách tôn giáo của Việt Nam.</p>';
    } else if (score.correct >= score.total * 0.7) {
        analysisHTML += '<p>✅ Bạn đã thể hiện sự hiểu biết tốt về chính sách tôn giáo. Hãy tiếp tục củng cố những phần còn thiếu.</p>';
    } else {
        analysisHTML += '<p>📚 Bạn cần ôn tập thêm. Hãy đọc kỹ lại các phần nội dung và làm lại quiz để cải thiện.</p>';
    }
    analysisHTML += '</div>';
    
    // Wrong Questions Analysis
    if (wrongQuestions.length > 0) {
        analysisHTML += '<div class="analysis-wrong">';
        analysisHTML += '<h5>❌ Những câu bạn trả lời sai:</h5>';
        wrongQuestions.forEach(({ index, question, userAnswer }) => {
            analysisHTML += `<div class="wrong-question-analysis">`;
            analysisHTML += `<p><strong>Câu ${index + 1}:</strong> ${question.question}</p>`;
            analysisHTML += `<p class="user-answer">Bạn đã chọn: ${question.options[userAnswer]}</p>`;
            analysisHTML += `<p class="correct-answer">Đáp án đúng: ${question.options[question.correct]}</p>`;
            analysisHTML += `<p class="explanation">${getExplanation(index)}</p>`;
            analysisHTML += `</div>`;
        });
        analysisHTML += '</div>';
    }
    
    // Correct Questions Summary
    if (correctQuestions.length > 0) {
        analysisHTML += '<div class="analysis-correct">';
        analysisHTML += '<h5>✅ Những câu bạn trả lời đúng:</h5>';
        analysisHTML += '<p>Bạn đã trả lời đúng ' + correctQuestions.length + ' câu hỏi về: ';
        const topics = correctQuestions.map(({ question }) => {
            if (question.question.includes('Hiến pháp')) return 'Quyền tự do tín ngưỡng';
            if (question.question.includes('bình đẳng')) return 'Bình đẳng tôn giáo';
            if (question.question.includes('hoạt động')) return 'Hoạt động tôn giáo';
            if (question.question.includes('đạo đức')) return 'Giá trị đạo đức';
            if (question.question.includes('văn hóa')) return 'Bảo tồn văn hóa';
            if (question.question.includes('thi đua')) return 'Phong trào thi đua';
            if (question.question.includes('từ thiện')) return 'Hoạt động từ thiện';
            if (question.question.includes('môi trường')) return 'Bảo vệ môi trường';
            if (question.question.includes('đoàn kết')) return 'Đoàn kết dân tộc';
            if (question.question.includes('Hồ Chí Minh')) return 'Tư tưởng Hồ Chí Minh';
            return 'Kiến thức tổng hợp';
        });
        analysisHTML += [...new Set(topics)].join(', ') + '.</p>';
        analysisHTML += '</div>';
    }
    
    // Recommendations
    analysisHTML += '<div class="analysis-recommendations">';
    analysisHTML += '<h5>💡 Gợi ý cải thiện:</h5>';
    if (wrongQuestions.length > 0) {
        analysisHTML += '<ul>';
        wrongQuestions.forEach(({ question }) => {
            if (question.question.includes('Hiến pháp')) {
                analysisHTML += '<li>Hãy đọc lại phần "Chính sách Tôn giáo" để hiểu rõ hơn về quyền tự do tín ngưỡng.</li>';
            } else if (question.question.includes('hoạt động')) {
                analysisHTML += '<li>Xem lại phần "Hoạt động" để nắm rõ các hoạt động hợp pháp của tôn giáo.</li>';
            } else if (question.question.includes('giá trị')) {
                analysisHTML += '<li>Đọc kỹ phần "Giá trị Tốt đẹp của Tôn giáo" để hiểu các giá trị đạo đức.</li>';
            }
        });
        analysisHTML += '</ul>';
    }
    analysisHTML += '<p>💬 Bạn có thể hỏi AI trợ lý để được giải thích chi tiết hơn về bất kỳ câu hỏi nào!</p>';
    analysisHTML += '</div>';
    
    analysisHTML += '</div>';
    return analysisHTML;
}

// Get explanation for each question
function getExplanation(questionIndex) {
    const explanations = {
        0: "Theo Hiến pháp Việt Nam, mọi công dân đều có quyền tự do tín ngưỡng, tôn giáo. Đây là quyền cơ bản được Nhà nước tôn trọng và bảo hộ.",
        1: "Nhà nước Việt Nam đối xử bình đẳng với tất cả các tôn giáo. Tất cả các tôn giáo đều bình đẳng trước pháp luật, không có sự phân biệt đối xử.",
        2: "Các tổ chức tôn giáo được phép thực hiện nhiều hoạt động hợp pháp như nghi lễ, quản lý cơ sở thờ tự, đào tạo chức sắc theo đúng quy định của pháp luật.",
        3: "Tham lam không phải là giá trị đạo đức mà tôn giáo hướng con người đến. Các giá trị đạo đức của tôn giáo là yêu thương, khoan dung, nhân ái, công bằng, trung thực.",
        4: "Tôn giáo góp phần quan trọng trong việc bảo tồn và phát huy các giá trị văn hóa truyền thống của dân tộc, không chỉ riêng kiến trúc hay nghệ thuật.",
        5: "Các tổ chức tôn giáo tích cực tham gia nhiều phong trào thi đua yêu nước như 'Toàn dân đoàn kết xây dựng đời sống văn hóa', 'Xây dựng nông thôn mới'.",
        6: "Hoạt động từ thiện của các tổ chức tôn giáo rất đa dạng, bao gồm xây nhà tình thương, hỗ trợ người nghèo, trẻ em mồ côi, và cứu trợ thiên tai.",
        7: "Mô hình 'Chùa xanh', 'Nhà thờ xanh' thể hiện sự tham gia tích cực của tôn giáo vào công tác bảo vệ môi trường, góp phần phát triển bền vững.",
        8: "Tôn giáo góp phần quan trọng trong việc tăng cường đoàn kết dân tộc, xây dựng khối đại đoàn kết toàn dân, thúc đẩy hòa giải, hòa hợp dân tộc.",
        9: "Câu nói 'Tín ngưỡng tự do và lương giáo đoàn kết' là của Chủ tịch Hồ Chí Minh, thể hiện tư tưởng của Người về tôn giáo."
    };
    return explanations[questionIndex] || "Hãy đọc lại nội dung liên quan để hiểu rõ hơn về câu hỏi này.";
}

// Reset Quiz
function resetQuiz() {
    currentQuestion = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    quizStarted = false;
    
    quizIntro.style.display = 'block';
    quizContent.style.display = 'none';
    quizResults.style.display = 'none';
    
    progressFill.style.width = '0%';
    progressText.textContent = 'Câu 1 / 10';
}

// Initialize DOM Elements and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM Elements
    quizIntro = document.getElementById('quizIntro');
    quizContent = document.getElementById('quizContent');
    quizQuestionsContainer = document.getElementById('quizQuestions');
    quizResults = document.getElementById('quizResults');
    startQuizBtn = document.getElementById('startQuiz');
    nextQuestionBtn = document.getElementById('nextQuestion');
    prevQuestionBtn = document.getElementById('prevQuestion');
    submitQuizBtn = document.getElementById('submitQuiz');
    retakeQuizBtn = document.getElementById('retakeQuiz');
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');

    // Check if elements exist
    if (!startQuizBtn || !quizIntro || !quizContent) {
        console.error('Quiz elements not found');
        return;
    }

    // Event Listeners
    startQuizBtn.addEventListener('click', () => {
        quizIntro.style.display = 'none';
        quizContent.style.display = 'block';
        initQuiz();
        scrollToQuestion();
    });

    nextQuestionBtn.addEventListener('click', nextQuestion);
    prevQuestionBtn.addEventListener('click', previousQuestion);
    
    submitQuizBtn.addEventListener('click', () => {
        // Check if all questions are answered
        const unanswered = userAnswers.filter(answer => answer === null).length;
        if (unanswered > 0) {
            if (confirm(`Bạn còn ${unanswered} câu chưa trả lời. Bạn có muốn nộp bài không?`)) {
                showResults();
            }
        } else {
            showResults();
        }
    });

    retakeQuizBtn.addEventListener('click', resetQuiz);
});

// Make selectAnswer available globally
window.selectAnswer = selectAnswer;

