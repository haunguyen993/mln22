// AI Article Generator
class ArticleGenerator {
    constructor() {
        this.currentArticle = null;
        this.init();
    }

    init() {
        const topicSelect = document.getElementById('articleTopic');
        const generateBtn = document.getElementById('generateArticle');
        const religionSelectGroup = document.getElementById('religionSelectGroup');
        const customTopicGroup = document.getElementById('customTopicGroup');
        const copyBtn = document.getElementById('copyArticle');
        const downloadBtn = document.getElementById('downloadArticle');
        const regenerateBtn = document.getElementById('regenerateArticle');

        if (!topicSelect || !generateBtn) return;

        // Topic selection handler
        topicSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === 'religion') {
                religionSelectGroup.style.display = 'block';
                customTopicGroup.style.display = 'none';
            } else if (value === 'custom') {
                religionSelectGroup.style.display = 'none';
                customTopicGroup.style.display = 'block';
            } else {
                religionSelectGroup.style.display = 'none';
                customTopicGroup.style.display = 'none';
            }
        });

        // Generate article
        generateBtn.addEventListener('click', () => this.generateArticle());

        // Copy article
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyArticle());
        }

        // Download article
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadArticle());
        }

        // Regenerate article
        if (regenerateBtn) {
            regenerateBtn.addEventListener('click', () => this.generateArticle());
        }
    }

    async generateArticle() {
        const topic = document.getElementById('articleTopic').value;
        const religion = document.getElementById('religionSelect').value;
        const customTopic = document.getElementById('customTopic').value;
        const length = 'medium'; // Default length
        const style = document.getElementById('articleStyle').value;

        // Validation
        if (!topic) {
            alert('Vui lòng chọn chủ đề bài viết!');
            return;
        }

        if (topic === 'religion' && !religion) {
            alert('Vui lòng chọn tôn giáo!');
            return;
        }

        if (topic === 'custom' && !customTopic.trim()) {
            alert('Vui lòng nhập chủ đề tùy chỉnh!');
            return;
        }

        // Show loading
        this.showLoading();

        try {
            // Try to use AI API first
            const aiArticle = await this.generateWithAI(topic, religion, customTopic, style);
            
            if (aiArticle && aiArticle.success) {
                // Display AI-generated article
                this.displayAIArticle(aiArticle.article, topic, religion, customTopic, style);
            } else {
                // Fallback to rule-based
                await this.simulateLoadingSteps();
                const article = this.createArticle(topic, religion, customTopic, length, style);
                this.displayArticle(article);
            }
        } catch (error) {
            console.error('AI generation error:', error);
            // Fallback to rule-based
            await this.simulateLoadingSteps();
            const article = this.createArticle(topic, religion, customTopic, length, style);
            this.displayArticle(article);
        }
    }

    async generateWithAI(topic, religion, customTopic, style) {
        try {
            // Get context from knowledge base
            let context = '';
            if (topic === 'religion' && religion) {
                const religionData = religionKnowledge.religions[religion];
                if (religionData) {
                    context = `Thông tin về ${religion}: ${JSON.stringify(religionData)}`;
                }
            }

            const response = await fetch('/api/generate-article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    religion,
                    customTopic,
                    style,
                    context
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('AI API not available, using fallback:', error);
            return null;
        }
    }

    displayAIArticle(articleContent, topic, religion, customTopic, style) {
        document.getElementById('articleLoading').style.display = 'none';
        const output = document.getElementById('articleOutput');
        output.style.display = 'block';

        // Generate title
        let title = '';
        if (topic === 'religion' && religion) {
            title = `Tìm hiểu về ${religion}`;
        } else if (topic === 'custom' && customTopic) {
            title = customTopic;
        } else {
            title = this.getTitleForTopic(topic);
        }

        document.getElementById('articleTitle').textContent = title;
        document.getElementById('articleContent').innerHTML = articleContent;

        // Word count
        const wordCount = articleContent.replace(/<[^>]*>/g, '').split(/\s+/).length;
        document.getElementById('articleWordCount').textContent = `Số từ: ${wordCount}`;

        // Generated time
        const now = new Date();
        document.getElementById('articleGeneratedTime').textContent = 
            `Tạo lúc: ${now.toLocaleString('vi-VN')} (AI Generated)`;

        this.currentArticle = { title, content: articleContent, style };

        // Scroll to article
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    getTitleForTopic(topic) {
        const titles = {
            'comparison': 'So sánh các tôn giáo lớn trên thế giới',
            'concept': 'Các khái niệm cơ bản về tôn giáo',
            'practice': 'Thực hành tôn giáo trong đời sống',
            'policy': 'Chính sách tôn giáo của Việt Nam',
            'history': 'Lịch sử phát triển của các tôn giáo'
        };
        return titles[topic] || 'Bài viết về tôn giáo';
    }

    async simulateLoadingSteps() {
        const steps = document.querySelectorAll('.loading-steps .step');
        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            steps[i].classList.add('active');
            if (i > 0) {
                steps[i - 1].classList.remove('active');
            }
        }
    }

    showLoading() {
        document.getElementById('articleOutput').style.display = 'none';
        document.getElementById('articleLoading').style.display = 'block';
        
        // Reset steps
        document.querySelectorAll('.loading-steps .step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('.loading-steps .step').classList.add('active');
    }

    createArticle(topic, religion, customTopic, length, style) {
        let title = '';
        let content = '';

        switch (topic) {
            case 'religion':
                title = `Tìm hiểu về ${religion}`;
                content = this.generateReligionArticle(religion, length, style);
                break;
            case 'comparison':
                title = 'So sánh các tôn giáo lớn trên thế giới';
                content = this.generateComparisonArticle(length, style);
                break;
            case 'concept':
                title = 'Các khái niệm cơ bản về tôn giáo';
                content = this.generateConceptArticle(length, style);
                break;
            case 'practice':
                title = 'Thực hành tôn giáo trong đời sống';
                content = this.generatePracticeArticle(length, style);
                break;
            case 'policy':
                title = 'Chính sách tôn giáo của Việt Nam';
                content = this.generatePolicyArticle(length, style);
                break;
            case 'history':
                title = 'Lịch sử phát triển của các tôn giáo';
                content = this.generateHistoryArticle(length, style);
                break;
            case 'custom':
                title = customTopic;
                content = this.generateCustomArticle(customTopic, length, style);
                break;
        }

        return { title, content, length, style };
    }

    generateReligionArticle(religionName, length, style) {
        const religion = religionKnowledge.religions[religionName];
        if (!religion) return 'Không tìm thấy thông tin về tôn giáo này.';

        let article = '';

        // Introduction - varies by style
        article += `<h2>Giới thiệu về ${religion.name}</h2>`;
        
        if (style === 'academic') {
            article += `<p>${religion.name} (${this.getEnglishName(religionName)}) là một trong những tôn giáo lớn nhất trên thế giới, với số lượng tín đồ ước tính khoảng ${religion.followers}. `;
            if (religion.origin) {
                article += `Theo các nghiên cứu lịch sử, tôn giáo này có nguồn gốc từ ${religion.origin}. `;
            }
            if (religion.founder) {
                article += `Người sáng lập được ghi nhận là ${religion.founder}. `;
            }
            article += `Hiện tại, ${religion.name} được thực hành chủ yếu tại các khu vực: ${religion.mainRegions}.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Hãy cùng khám phá ${religion.name} - một trong những tôn giáo lớn nhất thế giới với ${religion.followers} tín đồ! `;
            if (religion.origin) {
                article += `Câu chuyện bắt đầu từ ${religion.origin}, nơi mà `;
            }
            if (religion.founder) {
                article += `${religion.founder} đã khởi xướng một hành trình tâm linh vĩ đại. `;
            }
            article += `Ngày nay, bạn có thể tìm thấy ${religion.name} tại ${religion.mainRegions}, nơi hàng triệu người đang thực hành và sống theo giáo lý của tôn giáo này.</p>`;
        } else if (style === 'comparative') {
            article += `<p>Khi so sánh với các tôn giáo khác, ${religion.name} nổi bật với ${religion.followers} tín đồ, đứng trong số các tôn giáo lớn nhất thế giới. `;
            if (religion.origin) {
                article += `Khác với nhiều tôn giáo khác có nguồn gốc từ Trung Đông, ${religion.name} bắt nguồn từ ${religion.origin}. `;
            }
            article += `Sự phân bố địa lý của ${religion.name} tập trung chủ yếu tại ${religion.mainRegions}, tạo nên một bản sắc văn hóa và tôn giáo đặc trưng.</p>`;
        } else {
            // informative (default)
            article += `<p>${religion.name} là một trong những tôn giáo lớn trên thế giới với ${religion.followers}. `;
            if (religion.origin) {
                article += `Tôn giáo này có nguồn gốc từ ${religion.origin}. `;
            }
            if (religion.founder) {
                article += `Người sáng lập là ${religion.founder}. `;
            }
            article += `Hiện nay, ${religion.name} phổ biến tại ${religion.mainRegions}.</p>`;
        }

        // Key Beliefs - varies by style
        if (religion.keyBeliefs && religion.keyBeliefs.length > 0) {
            article += `<h2>Giáo lý và Niềm tin chính</h2>`;
            
            if (style === 'academic') {
                article += `<p>Các học giả và nhà nghiên cứu tôn giáo đã xác định rằng ${religion.name} được xây dựng trên nền tảng của những giáo lý cốt lõi sau đây, mỗi giáo lý đều có ý nghĩa triết học và thực tiễn sâu sắc:</p>`;
            } else if (style === 'narrative') {
                article += `<p>Hãy cùng khám phá những giáo lý cốt lõi làm nên ${religion.name} - những điều mà hàng triệu tín đồ đang sống và thực hành mỗi ngày:</p>`;
            } else if (style === 'comparative') {
                article += `<p>So với các tôn giáo khác, ${religion.name} có những giáo lý đặc trưng sau, tạo nên sự khác biệt và độc đáo:</p>`;
            } else {
                article += `<p>${religion.name} được xây dựng trên những giáo lý và niềm tin cơ bản sau:</p>`;
            }
            
            article += `<ul>`;
            religion.keyBeliefs.forEach(belief => {
                const description = this.getBeliefDescription(religionName, belief);
                if (style === 'academic') {
                    article += `<li><strong>${belief}</strong>: ${description} Đây là một khái niệm quan trọng trong hệ thống giáo lý của ${religion.name}.</li>`;
                } else if (style === 'narrative') {
                    article += `<li><strong>${belief}</strong>: ${description} Hãy tưởng tượng điều này như một ngọn đèn soi đường cho các tín đồ.</li>`;
                } else {
                    article += `<li><strong>${belief}</strong>: ${description}</li>`;
                }
            });
            article += `</ul>`;
        }

        // Practices - varies by style
        if (religion.practices && religion.practices.length > 0) {
            article += `<h2>Thực hành và Nghi lễ</h2>`;
            
            if (style === 'academic') {
                article += `<p>Nghiên cứu về thực hành tôn giáo cho thấy các tín đồ của ${religion.name} tuân theo một hệ thống nghi lễ được quy định rõ ràng, bao gồm:</p>`;
            } else if (style === 'narrative') {
                article += `<p>Mỗi ngày, hàng triệu tín đồ của ${religion.name} thực hiện những nghi lễ thiêng liêng này, tạo nên một nhịp sống tâm linh đầy ý nghĩa:</p>`;
            } else if (style === 'comparative') {
                article += `<p>Khác với các tôn giáo khác, ${religion.name} có những thực hành đặc trưng sau, phản ánh bản sắc riêng của tôn giáo này:</p>`;
            } else {
                article += `<p>Các tín đồ của ${religion.name} thực hành nhiều nghi lễ và hoạt động tôn giáo quan trọng:</p>`;
            }
            
            article += `<ul>`;
            religion.practices.forEach(practice => {
                if (style === 'narrative') {
                    article += `<li>✨ ${practice}</li>`;
                } else {
                    article += `<li>${practice}</li>`;
                }
            });
            article += `</ul>`;
        }

        // Texts
        if (religion.texts && religion.texts.length > 0) {
            article += `<h2>Kinh sách và Văn bản thiêng liêng</h2>`;
            article += `<p>${religion.name} có các kinh sách và văn bản thiêng liêng quan trọng như: ${religion.texts.join(', ')}. `;
            article += `Những văn bản này chứa đựng giáo lý, lịch sử và hướng dẫn thực hành cho các tín đồ.</p>`;
        }

        // Branches
        if (religion.branches && religion.branches.length > 0) {
            article += `<h2>Các nhánh và Truyền thống</h2>`;
            article += `<p>Trải qua lịch sử phát triển, ${religion.name} đã hình thành nhiều nhánh và truyền thống khác nhau: ${religion.branches.join(', ')}. `;
            article += `Mỗi nhánh có những đặc điểm riêng nhưng đều chia sẻ những giáo lý cơ bản chung.</p>`;
        }

        // Impact
        article += `<h2>Ảnh hưởng và Đóng góp</h2>`;
        article += `<p>${religion.name} đã có ảnh hưởng sâu sắc đến văn hóa, xã hội và đời sống tinh thần của hàng triệu người trên thế giới. `;
        article += `Tôn giáo này không chỉ cung cấp hướng dẫn về đạo đức và tinh thần mà còn góp phần vào việc xây dựng cộng đồng, thúc đẩy các giá trị nhân văn và bảo tồn di sản văn hóa.</p>`;

        // Conclusion - varies by style
        article += `<h2>Kết luận</h2>`;
        
        if (style === 'academic') {
            article += `<p>Tóm lại, ${religion.name} đại diện cho một hệ thống tôn giáo phức tạp và đa chiều, với lịch sử phát triển lâu dài và giáo lý triết học sâu sắc. `;
            article += `Nghiên cứu về ${religion.name} không chỉ mở rộng hiểu biết về đa dạng tôn giáo mà còn góp phần vào việc thúc đẩy đối thoại liên tôn và sự tôn trọng lẫn nhau giữa các cộng đồng tôn giáo khác nhau.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Như vậy, hành trình khám phá ${religion.name} đã đưa chúng ta đến với một thế giới tâm linh phong phú và đầy cảm hứng. `;
            article += `Từ những giáo lý sâu sắc đến các thực hành thiêng liêng, ${religion.name} không chỉ là một tôn giáo mà còn là một cách sống, một con đường dẫn đến sự bình an và hạnh phúc cho hàng triệu người trên thế giới.</p>`;
        } else if (style === 'comparative') {
            article += `<p>Qua việc phân tích và so sánh, chúng ta thấy rằng ${religion.name} có những đặc điểm riêng biệt nhưng cũng chia sẻ nhiều giá trị chung với các tôn giáo khác. `;
            article += `Sự hiểu biết về ${religion.name} giúp chúng ta nhận ra rằng, dù khác biệt về giáo lý và thực hành, tất cả các tôn giáo đều hướng đến mục tiêu chung là hướng dẫn con người sống đạo đức và có ý nghĩa.</p>`;
        } else {
            article += `<p>${religion.name} là một tôn giáo phong phú với lịch sử lâu đời và giáo lý sâu sắc. `;
            article += `Việc tìm hiểu về ${religion.name} giúp chúng ta hiểu rõ hơn về đa dạng tôn giáo trên thế giới và tôn trọng các niềm tin khác nhau.</p>`;
        }

        return this.adjustLength(article, length);
    }

    generateComparisonArticle(length, style) {
        let article = '';

        article += `<h2>So sánh các tôn giáo lớn trên thế giới</h2>`;
        
        if (style === 'academic') {
            article += `<p>Nghiên cứu so sánh tôn giáo là một lĩnh vực quan trọng trong khoa học tôn giáo. `;
            article += `Bài viết này sẽ thực hiện một phân tích so sánh có hệ thống về các tôn giáo lớn trên thế giới, tập trung vào các khía cạnh giáo lý, thực hành và ảnh hưởng văn hóa-xã hội của chúng.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Hãy cùng bước vào một cuộc hành trình khám phá các tôn giáo lớn trên thế giới! `;
            article += `Mỗi tôn giáo như một bông hoa độc đáo trong vườn hoa tâm linh của nhân loại - khác biệt về màu sắc nhưng cùng tỏa hương thơm của tình yêu và lòng từ bi.</p>`;
        } else if (style === 'comparative') {
            article += `<p>Việc so sánh các tôn giáo lớn cho phép chúng ta nhận ra cả sự đa dạng lẫn những điểm chung. `;
            article += `Bài viết này sẽ đặt các tôn giáo cạnh nhau để phân tích điểm tương đồng và khác biệt về giáo lý, thực hành và ảnh hưởng.</p>`;
        } else {
            article += `<p>Thế giới có nhiều tôn giáo lớn, mỗi tôn giáo có những đặc điểm riêng biệt nhưng cũng có những điểm tương đồng. `;
            article += `Bài viết này sẽ so sánh một số tôn giáo lớn về giáo lý, thực hành và ảnh hưởng.</p>`;
        }

        // Comparison table
        article += `<h2>Bảng so sánh tổng quan</h2>`;
        article += `<table class="comparison-table">`;
        article += `<thead><tr><th>Tôn giáo</th><th>Số tín đồ</th><th>Nguồn gốc</th><th>Đặc điểm nổi bật</th></tr></thead>`;
        article += `<tbody>`;
        
        const religions = ['Phật giáo', 'Công giáo', 'Hồi giáo', 'Ấn Độ giáo'];
        religions.forEach(religionName => {
            const religion = religionKnowledge.religions[religionName];
            if (religion) {
                article += `<tr>`;
                article += `<td><strong>${religion.name}</strong></td>`;
                article += `<td>${religion.followers}</td>`;
                article += `<td>${religion.origin || 'N/A'}</td>`;
                article += `<td>${religion.keyBeliefs ? religion.keyBeliefs[0] : 'N/A'}</td>`;
                article += `</tr>`;
            }
        });
        article += `</tbody></table>`;

        // Similarities
        article += `<h2>Điểm tương đồng</h2>`;
        article += `<p>Các tôn giáo lớn trên thế giới có nhiều điểm tương đồng:</p>`;
        article += `<ul>`;
        article += `<li><strong>Giá trị đạo đức chung</strong>: Hầu hết các tôn giáo đều đề cao các giá trị như yêu thương, khoan dung, công bằng, và từ bi.</li>`;
        article += `<li><strong>Hướng dẫn đời sống</strong>: Các tôn giáo đều cung cấp hướng dẫn về cách sống đạo đức và có ý nghĩa.</li>`;
        article += `<li><strong>Cộng đồng</strong>: Tất cả các tôn giáo đều tạo ra cộng đồng tín đồ gắn kết với nhau.</li>`;
        article += `<li><strong>Nghi lễ và thực hành</strong>: Mỗi tôn giáo đều có các nghi lễ và thực hành tôn giáo riêng.</li>`;
        article += `</ul>`;

        // Differences
        article += `<h2>Điểm khác biệt</h2>`;
        article += `<p>Bên cạnh những điểm tương đồng, các tôn giáo cũng có những khác biệt quan trọng:</p>`;
        article += `<ul>`;
        article += `<li><strong>Quan niệm về thần linh</strong>: Mỗi tôn giáo có quan niệm khác nhau về thần linh hoặc thực thể thiêng liêng.</li>`;
        article += `<li><strong>Giáo lý và kinh sách</strong>: Mỗi tôn giáo có hệ thống giáo lý và kinh sách riêng.</li>`;
        article += `<li><strong>Thực hành</strong>: Các nghi lễ và thực hành tôn giáo khác nhau giữa các tôn giáo.</li>`;
        article += `<li><strong>Lịch sử và truyền thống</strong>: Mỗi tôn giáo có lịch sử và truyền thống phát triển riêng.</li>`;
        article += `</ul>`;

        // Conclusion
        article += `<h2>Kết luận</h2>`;
        article += `<p>Việc so sánh các tôn giáo giúp chúng ta hiểu rõ hơn về sự đa dạng tôn giáo trên thế giới. `;
        article += `Mặc dù có những khác biệt, các tôn giáo đều hướng đến mục tiêu chung là hướng dẫn con người sống đạo đức và có ý nghĩa. `;
        article += `Sự tôn trọng và hiểu biết lẫn nhau giữa các tôn giáo là điều quan trọng để xây dựng một thế giới hòa bình và hài hòa.</p>`;

        return this.adjustLength(article, length);
    }

    generateConceptArticle(length, style) {
        let article = '';

        article += `<h2>Các khái niệm cơ bản về tôn giáo</h2>`;
        
        if (style === 'academic') {
            article += `<p>Trong nghiên cứu tôn giáo học, việc nắm vững các khái niệm cơ bản là nền tảng quan trọng. `;
            article += `Các khái niệm này không chỉ giúp phân tích và hiểu các hiện tượng tôn giáo mà còn tạo cơ sở cho việc so sánh và đối chiếu giữa các truyền thống tôn giáo khác nhau.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Trước khi bước vào thế giới tôn giáo đầy màu sắc, hãy cùng làm quen với những khái niệm cơ bản - những viên gạch đầu tiên xây nên ngôi nhà hiểu biết của chúng ta về tôn giáo.</p>`;
        } else if (style === 'comparative') {
            article += `<p>Để so sánh các tôn giáo một cách hiệu quả, chúng ta cần hiểu rõ các khái niệm cơ bản. `;
            article += `Những khái niệm này giúp chúng ta nhận ra điểm chung và sự khác biệt giữa các tôn giáo.</p>`;
        } else {
            article += `<p>Tôn giáo là một phần quan trọng trong đời sống của nhiều người trên thế giới. `;
            article += `Để hiểu rõ về tôn giáo, chúng ta cần nắm vững các khái niệm cơ bản.</p>`;
        }

        // Concepts
        Object.entries(religionKnowledge.concepts).forEach(([key, concept]) => {
            article += `<h2>${key.charAt(0).toUpperCase() + key.slice(1)}</h2>`;
            article += `<p><strong>Định nghĩa:</strong> ${concept.definition}</p>`;
            if (concept.importance) {
                article += `<p><strong>Ý nghĩa:</strong> ${concept.importance}</p>`;
            }
            if (concept.vietnam) {
                article += `<p><strong>Tại Việt Nam:</strong> ${concept.vietnam}</p>`;
            }
        });

        return this.adjustLength(article, length);
    }

    generatePracticeArticle(length, style) {
        let article = '';

        article += `<h2>Thực hành tôn giáo trong đời sống</h2>`;
        
        if (style === 'academic') {
            article += `<p>Theo định nghĩa trong tôn giáo học, thực hành tôn giáo (religious practices) là những hành vi, nghi lễ và hoạt động có tính chất tôn giáo mà các tín đồ thực hiện nhằm thể hiện niềm tin, duy trì mối liên hệ với thần linh hoặc thực thể thiêng liêng, và củng cố bản sắc tôn giáo của mình.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Hãy tưởng tượng thực hành tôn giáo như những cây cầu nối giữa thế giới vật chất và thế giới tâm linh - nơi mà các tín đồ có thể gặp gỡ, kết nối và cảm nhận sự hiện diện của điều thiêng liêng trong cuộc sống hàng ngày của họ.</p>`;
        } else if (style === 'comparative') {
            article += `<p>Khi so sánh các tôn giáo, chúng ta thấy rằng mỗi tôn giáo có những thực hành riêng, nhưng cũng có nhiều điểm tương đồng. `;
            article += `Thực hành tôn giáo là cách các tín đồ thể hiện niềm tin và kết nối với thần linh hoặc thực thể thiêng liêng.</p>`;
        } else {
            article += `<p>Thực hành tôn giáo là những hoạt động cụ thể mà các tín đồ thực hiện để thể hiện niềm tin và kết nối với thần linh hoặc thực thể thiêng liêng.</p>`;
        }

        Object.entries(religionKnowledge.practices).forEach(([key, practice]) => {
            article += `<h2>${key.charAt(0).toUpperCase() + key.slice(1)}</h2>`;
            article += `<p>${practice.description}</p>`;
            if (practice.religions) {
                article += `<p><strong>Các tôn giáo thực hành:</strong> ${practice.religions.join(', ')}</p>`;
            }
            if (practice.benefits) {
                article += `<p><strong>Lợi ích:</strong> ${practice.benefits}</p>`;
            }
        });

        return this.adjustLength(article, length);
    }

    generatePolicyArticle(length, style) {
        let article = '';

        article += `<h2>Chính sách tôn giáo của Việt Nam</h2>`;
        
        if (style === 'academic') {
            article += `<p>Việt Nam, với tư cách là một quốc gia đa tôn giáo, đã xây dựng một hệ thống chính sách tôn giáo dựa trên các nguyên tắc pháp lý và hiến định. `;
            article += `Hệ thống chính sách này được thiết kế nhằm đảm bảo quyền tự do tín ngưỡng, tôn giáo của công dân đồng thời duy trì sự ổn định và hòa hợp xã hội.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Việt Nam - một đất nước nơi nhiều tôn giáo cùng chung sống hòa bình, tạo nên một bức tranh đa sắc màu về tín ngưỡng. `;
            article += `Nhà nước Việt Nam đã xây dựng những chính sách thông minh để đảm bảo mọi người đều có quyền tự do tín ngưỡng, tạo nên một xã hội hài hòa và đoàn kết.</p>`;
        } else if (style === 'comparative') {
            article += `<p>So với nhiều quốc gia khác, Việt Nam có một cách tiếp cận đặc biệt trong việc quản lý tôn giáo. `;
            article += `Là một quốc gia đa tôn giáo, Việt Nam đã phát triển các chính sách cân bằng giữa việc đảm bảo quyền tự do tín ngưỡng và duy trì sự ổn định xã hội.</p>`;
        } else {
            article += `<p>Việt Nam là một quốc gia đa tôn giáo, nơi nhiều tôn giáo cùng tồn tại và phát triển. `;
            article += `Nhà nước Việt Nam có những chính sách rõ ràng về tôn giáo nhằm đảm bảo quyền tự do tín ngưỡng và sự hòa hợp xã hội.</p>`;
        }

        article += `<h2>Quyền tự do tín ngưỡng, tôn giáo</h2>`;
        article += `<p>Theo Hiến pháp Việt Nam, mọi công dân đều có quyền tự do tín ngưỡng, tôn giáo. `;
        article += `Nhà nước tôn trọng và bảo hộ quyền này. Không ai được xâm phạm quyền tự do tín ngưỡng, tôn giáo của người khác.</p>`;

        article += `<h2>Bình đẳng tôn giáo</h2>`;
        article += `<p>Tất cả các tôn giáo đều bình đẳng trước pháp luật. Nhà nước không phân biệt đối xử hay ưu tiên bất kỳ tôn giáo nào.</p>`;

        article += `<h2>Hoạt động hợp pháp của tôn giáo</h2>`;
        article += `<p>Các tổ chức tôn giáo được phép hoạt động hợp pháp theo quy định của pháp luật, bao gồm:</p>`;
        article += `<ul>`;
        article += `<li>Thực hiện nghi lễ tôn giáo</li>`;
        article += `<li>Quản lý cơ sở thờ tự</li>`;
        article += `<li>Đào tạo chức sắc</li>`;
        article += `<li>Tham gia các hoạt động xã hội, từ thiện</li>`;
        article += `</ul>`;

        return this.adjustLength(article, length);
    }

    generateHistoryArticle(length, style) {
        let article = '';

        article += `<h2>Lịch sử phát triển của các tôn giáo</h2>`;
        
        if (style === 'academic') {
            article += `<p>Lịch sử tôn giáo là một lĩnh vực nghiên cứu quan trọng, cho phép chúng ta hiểu về sự phát triển và biến đổi của các truyền thống tôn giáo qua các thời kỳ lịch sử. `;
            article += `Tôn giáo đã xuất hiện từ thời cổ đại và trải qua nhiều giai đoạn phát triển phức tạp, phản ánh sự tương tác giữa yếu tố tôn giáo và các yếu tố văn hóa, chính trị, xã hội.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Hãy cùng quay ngược thời gian để khám phá hành trình kỳ diệu của các tôn giáo qua lịch sử! `;
            article += `Từ những ngôi đền cổ xưa đến những nhà thờ hiện đại, từ những vị thầy đầu tiên đến hàng tỷ tín đồ ngày nay - đây là câu chuyện về sự phát triển của tôn giáo trong lịch sử nhân loại.</p>`;
        } else if (style === 'comparative') {
            article += `<p>Khi so sánh lịch sử phát triển của các tôn giáo, chúng ta thấy rằng mỗi tôn giáo có một hành trình riêng nhưng cũng có những điểm chung. `;
            article += `Tất cả đều bắt đầu từ những khởi nguồn khiêm tốn và phát triển qua nhiều giai đoạn khác nhau.</p>`;
        } else {
            article += `<p>Tôn giáo đã tồn tại từ rất sớm trong lịch sử nhân loại và đã phát triển qua nhiều giai đoạn khác nhau.</p>`;
        }

        const timeline = [
            { period: 'Cổ đại (trước 500 TCN)', religions: ['Ấn Độ giáo', 'Do Thái giáo'] },
            { period: 'Cổ đại muộn (500 TCN - 500 SCN)', religions: ['Phật giáo', 'Đạo giáo', 'Nho giáo', 'Công giáo'] },
            { period: 'Trung đại (500 - 1500)', religions: ['Hồi giáo', 'Chính Thống giáo'] },
            { period: 'Cận đại (1500 - 1800)', religions: ['Tin Lành', 'Đạo Sikh'] },
            { period: 'Hiện đại (1800 - nay)', religions: ['Các tôn giáo mới', 'Phong trào tôn giáo mới'] }
        ];

        timeline.forEach(era => {
            article += `<h2>${era.period}</h2>`;
            article += `<p>Trong giai đoạn này, các tôn giáo như ${era.religions.join(', ')} đã phát triển và lan truyền rộng rãi.</p>`;
        });

        return this.adjustLength(article, length);
    }

    generateCustomArticle(topic, length, style) {
        let article = '';

        article += `<h2>${topic}</h2>`;
        
        if (style === 'academic') {
            article += `<p>Chủ đề "${topic}" là một lĩnh vực nghiên cứu quan trọng trong tôn giáo học. `;
            article += `Bài viết này sẽ thực hiện một phân tích có hệ thống về các khía cạnh khác nhau của chủ đề này, dựa trên các nguồn tài liệu và nghiên cứu hiện có.</p>`;
        } else if (style === 'narrative') {
            article += `<p>Hãy cùng khám phá "${topic}" - một chủ đề đầy thú vị và ý nghĩa trong thế giới tôn giáo! `;
            article += `Bài viết này sẽ đưa bạn vào một hành trình khám phá các khía cạnh khác nhau của chủ đề này, từ những góc nhìn mới mẻ đến những hiểu biết sâu sắc.</p>`;
        } else if (style === 'comparative') {
            article += `<p>Khi phân tích chủ đề "${topic}", chúng ta có thể so sánh cách các tôn giáo khác nhau tiếp cận và thực hành. `;
            article += `Bài viết này sẽ khám phá các khía cạnh khác nhau của chủ đề này thông qua lăng kính so sánh.</p>`;
        } else {
            article += `<p>Đây là một chủ đề thú vị về tôn giáo. Bài viết này sẽ khám phá các khía cạnh khác nhau của chủ đề "${topic}".</p>`;
        }

        // Try to find related information
        const searchResults = searchReligionKnowledge(topic);
        if (searchResults.length > 0) {
            article += `<h2>Thông tin liên quan</h2>`;
            searchResults.forEach(result => {
                if (result.type === 'religion') {
                    article += `<h3>${result.data.name}</h3>`;
                    article += `<p>${result.data.name} là một tôn giáo với ${result.data.followers} tín đồ.</p>`;
                }
            });
        }

        article += `<h2>Phân tích và Bình luận</h2>`;
        article += `<p>Chủ đề "${topic}" có nhiều khía cạnh đáng để khám phá. `;
        article += `Việc hiểu rõ về chủ đề này giúp chúng ta có cái nhìn sâu sắc hơn về tôn giáo và vai trò của nó trong xã hội.</p>`;

        return this.adjustLength(article, length);
    }

    getBeliefDescription(religionName, belief) {
        const descriptions = {
            'Phật giáo': {
                'Tứ Diệu Đế (Four Noble Truths)': 'Bốn chân lý cao quý về bản chất của đau khổ và con đường giải thoát.',
                'Bát Chánh Đạo (Eightfold Path)': 'Con đường tám nhánh dẫn đến giác ngộ và giải thoát khỏi đau khổ.',
                'Luân hồi và Nghiệp (Reincarnation and Karma)': 'Quan niệm về sự tái sinh và luật nhân quả.'
            }
        };
        return descriptions[religionName]?.[belief] || 'Một giáo lý quan trọng của tôn giáo này.';
    }

    getEnglishName(religionName) {
        const names = {
            'Phật giáo': 'Buddhism',
            'Công giáo': 'Catholicism',
            'Tin Lành': 'Protestantism',
            'Hồi giáo': 'Islam',
            'Ấn Độ giáo': 'Hinduism',
            'Do Thái giáo': 'Judaism',
            'Đạo Sikh': 'Sikhism',
            'Đạo giáo': 'Taoism',
            'Nho giáo': 'Confucianism',
            'Chính Thống giáo': 'Orthodox Christianity'
        };
        return names[religionName] || religionName;
    }

    adjustLength(content, length) {
        // Simple word count adjustment
        const words = content.split(/\s+/).length;
        const targetWords = {
            'short': 400,
            'medium': 800,
            'long': 1500
        };

        const target = targetWords[length] || 800;
        const ratio = target / words;

        if (ratio < 0.8) {
            // Need to shorten
            return content.substring(0, content.length * 0.8) + '...';
        } else if (ratio > 1.2) {
            // Need to expand
            return content + this.getAdditionalContent();
        }

        return content;
    }

    getAdditionalContent() {
        return '<p>Nội dung này có thể được mở rộng thêm với các thông tin chi tiết và phân tích sâu hơn về chủ đề.</p>';
    }

    displayArticle(article) {
        document.getElementById('articleLoading').style.display = 'none';
        const output = document.getElementById('articleOutput');
        output.style.display = 'block';

        document.getElementById('articleTitle').textContent = article.title;
        document.getElementById('articleContent').innerHTML = article.content;

        // Word count
        const wordCount = article.content.split(/\s+/).length;
        document.getElementById('articleWordCount').textContent = `Số từ: ${wordCount}`;

        // Generated time
        const now = new Date();
        document.getElementById('articleGeneratedTime').textContent = 
            `Tạo lúc: ${now.toLocaleString('vi-VN')}`;

        this.currentArticle = article;

        // Scroll to article
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    copyArticle() {
        const content = document.getElementById('articleContent').innerText;
        const title = document.getElementById('articleTitle').textContent;
        const fullText = title + '\n\n' + content;

        navigator.clipboard.writeText(fullText).then(() => {
            alert('Đã sao chép bài viết vào clipboard!');
        });
    }

    downloadArticle() {
        const content = document.getElementById('articleContent').innerHTML;
        const title = document.getElementById('articleTitle').textContent;
        
        const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #1a4d80; }
        h2 { color: #2d6ba3; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #1a4d80; color: white; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${content}
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new ArticleGenerator();
});

