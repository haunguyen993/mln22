// Religion Knowledge Base - Comprehensive knowledge about world religions
const religionKnowledge = {
    // Major World Religions
    religions: {
        'Phật giáo': {
            name: 'Phật giáo (Buddhism)',
            origin: 'Ấn Độ, thế kỷ 6-5 TCN',
            founder: 'Đức Phật Thích Ca Mâu Ni (Siddhartha Gautama)',
            followers: 'Khoảng 500 triệu người',
            mainRegions: 'Đông Nam Á, Đông Á, Sri Lanka',
            keyBeliefs: [
                'Tứ Diệu Đế (Four Noble Truths)',
                'Bát Chánh Đạo (Eightfold Path)',
                'Luân hồi và Nghiệp (Reincarnation and Karma)',
                'Niết bàn (Nirvana) - giải thoát khỏi đau khổ',
                'Vô thường, Vô ngã'
            ],
            practices: [
                'Thiền định (Meditation)',
                'Tụng kinh',
                'Cúng dường',
                'Giữ giới luật',
                'Hành thiện, tránh ác'
            ],
            texts: ['Kinh Phật (Tripitaka)', 'Kinh Đại thừa', 'Kinh Tiểu thừa'],
            branches: ['Thượng tọa bộ (Theravada)', 'Đại thừa (Mahayana)', 'Kim Cương thừa (Vajrayana)']
        },
        'Công giáo': {
            name: 'Công giáo (Catholicism)',
            origin: 'Palestine, thế kỷ 1',
            founder: 'Chúa Giêsu Kitô',
            followers: 'Khoảng 1.3 tỷ người',
            mainRegions: 'Châu Mỹ, Châu Âu, Châu Phi, Châu Á',
            keyBeliefs: [
                'Một Thiên Chúa Ba Ngôi (Trinity)',
                'Chúa Giêsu là Con Thiên Chúa và Đấng Cứu Thế',
                'Kinh Thánh là Lời Chúa',
                'Giáo hội Công giáo là Giáo hội duy nhất do Chúa Kitô thiết lập',
                'Các Bí tích (Sacraments)',
                'Sự sống lại và cuộc sống vĩnh cửu'
            ],
            practices: [
                'Tham dự Thánh lễ',
                'Cầu nguyện',
                'Xưng tội',
                'Rước lễ',
                'Làm việc bác ái',
                'Tuân giữ các điều răn'
            ],
            texts: ['Kinh Thánh (Bible)', 'Giáo lý Công giáo'],
            branches: ['Công giáo Rôma', 'Công giáo Đông phương']
        },
        'Tin Lành': {
            name: 'Tin Lành (Protestantism)',
            origin: 'Châu Âu, thế kỷ 16',
            founder: 'Martin Luther và các nhà cải cách',
            followers: 'Khoảng 900 triệu người',
            mainRegions: 'Bắc Mỹ, Châu Âu, Châu Phi, Châu Á',
            keyBeliefs: [
                'Chỉ có Kinh Thánh (Sola Scriptura)',
                'Chỉ bởi đức tin (Sola Fide)',
                'Chỉ bởi ân điển (Sola Gratia)',
                'Chỉ bởi Chúa Kitô (Solus Christus)',
                'Chỉ vì vinh quang của Chúa (Soli Deo Gloria)',
                'Tư tế phổ quát của tín đồ'
            ],
            practices: [
                'Đọc và nghiên cứu Kinh Thánh',
                'Cầu nguyện cá nhân',
                'Thờ phượng tập thể',
                'Truyền giáo',
                'Phục vụ cộng đồng'
            ],
            texts: ['Kinh Thánh (Bible)'],
            branches: ['Lutheran', 'Calvinist', 'Baptist', 'Methodist', 'Pentecostal', 'Anglican']
        },
        'Chính Thống giáo': {
            name: 'Chính Thống giáo (Orthodox Christianity)',
            origin: 'Đế quốc Đông La Mã, thế kỷ 1',
            followers: 'Khoảng 260 triệu người',
            mainRegions: 'Đông Âu, Nga, Hy Lạp, Trung Đông',
            keyBeliefs: [
                'Truyền thống tông đồ',
                'Bảy Công đồng Đại kết',
                'Thần học Hesychasm',
                'Tôn kính các thánh và thánh tượng',
                'Bí tích Thánh Thể'
            ],
            practices: [
                'Phụng vụ thánh',
                'Cầu nguyện với thánh tượng',
                'Ăn chay',
                'Hành hương',
                'Tôn kính các thánh'
            ],
            texts: ['Kinh Thánh', 'Các tác phẩm của Giáo phụ']
        },
        'Hồi giáo': {
            name: 'Hồi giáo (Islam)',
            origin: 'Bán đảo Ả Rập, thế kỷ 7',
            founder: 'Nhà tiên tri Muhammad',
            followers: 'Khoảng 1.9 tỷ người',
            mainRegions: 'Trung Đông, Bắc Phi, Nam Á, Đông Nam Á',
            keyBeliefs: [
                'Một Thiên Chúa duy nhất (Allah)',
                'Muhammad là sứ giả cuối cùng của Allah',
                'Năm trụ cột của Hồi giáo',
                'Kinh Qur\'an là Lời Chúa',
                'Ngày phán xét và cuộc sống sau khi chết',
                'Thiên đường và Địa ngục'
            ],
            practices: [
                'Shahada (Tuyên xưng đức tin)',
                'Salah (Cầu nguyện 5 lần mỗi ngày)',
                'Zakat (Bố thí)',
                'Sawm (Nhịn ăn trong tháng Ramadan)',
                'Hajj (Hành hương đến Mecca)'
            ],
            texts: ['Kinh Qur\'an', 'Hadith (Truyền thống của Nhà tiên tri)'],
            branches: ['Sunni (85%)', 'Shia (15%)', 'Sufi']
        },
        'Ấn Độ giáo': {
            name: 'Ấn Độ giáo (Hinduism)',
            origin: 'Ấn Độ, khoảng 2000-1500 TCN',
            followers: 'Khoảng 1.2 tỷ người',
            mainRegions: 'Ấn Độ, Nepal, Bangladesh, Indonesia',
            keyBeliefs: [
                'Brahman - Thực tại tối cao',
                'Atman - Linh hồn cá nhân',
                'Dharma - Đạo đức và nghĩa vụ',
                'Karma - Luật nhân quả',
                'Samsara - Luân hồi',
                'Moksha - Giải thoát'
            ],
            practices: [
                'Puja (Thờ cúng)',
                'Yoga và Thiền định',
                'Hành hương',
                'Lễ hội tôn giáo',
                'Tụng kinh Veda',
                'Thực hành Ahimsa (Bất bạo động)'
            ],
            texts: ['Vedas', 'Upanishads', 'Bhagavad Gita', 'Puranas'],
            branches: ['Vaishnavism', 'Shaivism', 'Shaktism', 'Smartism']
        },
        'Do Thái giáo': {
            name: 'Do Thái giáo (Judaism)',
            origin: 'Cận Đông, khoảng 2000 TCN',
            founder: 'Abraham, Moses',
            followers: 'Khoảng 15 triệu người',
            mainRegions: 'Israel, Hoa Kỳ, Châu Âu',
            keyBeliefs: [
                'Một Thiên Chúa duy nhất',
                'Giao ước giữa Thiên Chúa và dân tộc Do Thái',
                'Torah là Lời Chúa',
                'Messiah sẽ đến',
                'Sự phục sinh của người chết',
                'Thiên đường và Địa ngục'
            ],
            practices: [
                'Shabbat (Ngày nghỉ thánh)',
                'Kashrut (Luật ăn uống)',
                'Cầu nguyện hàng ngày',
                'Lễ hội tôn giáo',
                'Bar/Bat Mitzvah',
                'Học Torah'
            ],
            texts: ['Torah', 'Talmud', 'Midrash'],
            branches: ['Orthodox', 'Conservative', 'Reform', 'Reconstructionist']
        },
        'Đạo Sikh': {
            name: 'Đạo Sikh (Sikhism)',
            origin: 'Punjab, Ấn Độ, thế kỷ 15',
            founder: 'Guru Nanak',
            followers: 'Khoảng 30 triệu người',
            mainRegions: 'Punjab (Ấn Độ), Anh, Canada, Hoa Kỳ',
            keyBeliefs: [
                'Một Thiên Chúa duy nhất (Ik Onkar)',
                'Mười vị Guru',
                'Guru Granth Sahib là Guru vĩnh cửu',
                'Bình đẳng giữa mọi người',
                'Karma và Luân hồi',
                'Mukti - Giải thoát'
            ],
            practices: [
                'Cầu nguyện hàng ngày',
                'Tham dự Gurdwara (Đền thờ)',
                'Langar (Bữa ăn cộng đồng miễn phí)',
                'Mặc 5 K (5 biểu tượng)',
                'Seva (Phục vụ cộng đồng)'
            ],
            texts: ['Guru Granth Sahib'],
            branches: ['Khalsa', 'Sahajdhari']
        },
        'Đạo giáo': {
            name: 'Đạo giáo (Taoism)',
            origin: 'Trung Quốc, thế kỷ 6-4 TCN',
            founder: 'Lão Tử',
            followers: 'Khoảng 20-30 triệu người',
            mainRegions: 'Trung Quốc, Đài Loan, Việt Nam',
            keyBeliefs: [
                'Đạo (Tao) - Con đường tự nhiên',
                'Âm Dương - Sự cân bằng',
                'Vô vi - Hành động không cưỡng ép',
                'Tam bảo: Từ bi, Tiết kiệm, Khiêm tốn',
                'Bất tử và tu luyện'
            ],
            practices: [
                'Thiền định',
                'Qigong (Khí công)',
                'Feng Shui',
                'Thờ cúng tổ tiên',
                'Lễ hội tôn giáo'
            ],
            texts: ['Đạo Đức Kinh', 'Trang Tử'],
            branches: ['Đạo giáo triết học', 'Đạo giáo tôn giáo']
        },
        'Nho giáo': {
            name: 'Nho giáo (Confucianism)',
            origin: 'Trung Quốc, thế kỷ 6-5 TCN',
            founder: 'Khổng Tử (Confucius)',
            followers: 'Khoảng 6-7 triệu người (tín đồ chính thức)',
            mainRegions: 'Trung Quốc, Hàn Quốc, Nhật Bản, Việt Nam',
            keyBeliefs: [
                'Nhân - Lòng nhân ái',
                'Lễ - Lễ nghi và phép tắc',
                'Nghĩa - Công bằng',
                'Trí - Trí tuệ',
                'Tín - Thành tín',
                'Hiếu - Lòng hiếu thảo'
            ],
            practices: [
                'Thờ cúng tổ tiên',
                'Học tập và tự tu dưỡng',
                'Thực hành lễ nghi',
                'Tôn trọng người lớn tuổi',
                'Giáo dục đạo đức'
            ],
            texts: ['Luận Ngữ', 'Mạnh Tử', 'Đại Học', 'Trung Dung'],
            branches: ['Nho giáo cổ điển', 'Tân Nho giáo']
        }
    },

    // Religious Concepts
    concepts: {
        'tự do tín ngưỡng': {
            definition: 'Quyền của mỗi người được tự do lựa chọn, thực hành và thay đổi tín ngưỡng, tôn giáo của mình mà không bị ép buộc hay phân biệt đối xử.',
            importance: 'Đây là quyền cơ bản của con người được ghi nhận trong Tuyên ngôn Nhân quyền và các công ước quốc tế.',
            vietnam: 'Việt Nam tôn trọng và bảo đảm quyền tự do tín ngưỡng, tôn giáo theo Hiến pháp và pháp luật.'
        },
        'bình đẳng tôn giáo': {
            definition: 'Tất cả các tôn giáo đều được đối xử bình đẳng trước pháp luật, không có sự phân biệt đối xử hay ưu tiên.',
            importance: 'Đảm bảo công bằng xã hội và sự hòa hợp giữa các cộng đồng tôn giáo.',
            vietnam: 'Nhà nước Việt Nam đối xử bình đẳng với tất cả các tôn giáo.'
        },
        'đối thoại liên tôn': {
            definition: 'Cuộc đối thoại giữa các tôn giáo khác nhau để tìm hiểu, tôn trọng và hợp tác với nhau.',
            importance: 'Thúc đẩy sự hiểu biết, hòa bình và hợp tác giữa các cộng đồng tôn giáo.',
            examples: 'Các hội nghị liên tôn, các hoạt động từ thiện chung, các dự án phát triển cộng đồng.'
        }
    },

    // Religious Practices
    practices: {
        'thiền định': {
            religions: ['Phật giáo', 'Đạo giáo', 'Ấn Độ giáo'],
            description: 'Phương pháp rèn luyện tâm trí để đạt được sự tập trung, bình an và giác ngộ.',
            benefits: 'Giảm căng thẳng, tăng cường sự tập trung, phát triển trí tuệ và từ bi.'
        },
        'cầu nguyện': {
            religions: ['Công giáo', 'Tin Lành', 'Hồi giáo', 'Do Thái giáo'],
            description: 'Giao tiếp với thần linh hoặc thực thể thiêng liêng thông qua lời nói, suy nghĩ hoặc hành động.',
            frequency: 'Tùy theo tôn giáo, có thể là hàng ngày, nhiều lần trong ngày, hoặc trong các dịp đặc biệt.'
        },
        'hành hương': {
            religions: ['Hồi giáo', 'Phật giáo', 'Ấn Độ giáo', 'Công giáo'],
            description: 'Cuộc hành trình đến các địa điểm thiêng liêng để thể hiện lòng tôn kính và tìm kiếm sự thanh tẩy tâm linh.',
            examples: 'Mecca (Hồi giáo), Lumbini (Phật giáo), Varanasi (Ấn Độ giáo), Jerusalem (Công giáo, Do Thái giáo).'
        }
    }
};

// Search function to find relevant information
function searchReligionKnowledge(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    // Search in religions
    for (const [key, religion] of Object.entries(religionKnowledge.religions)) {
        if (lowerQuery.includes(key.toLowerCase()) || 
            lowerQuery.includes(religion.name.toLowerCase()) ||
            religion.name.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'religion',
                key: key,
                data: religion
            });
        }
    }

    // Search in concepts
    for (const [key, concept] of Object.entries(religionKnowledge.concepts)) {
        if (lowerQuery.includes(key.toLowerCase())) {
            results.push({
                type: 'concept',
                key: key,
                data: concept
            });
        }
    }

    // Search in practices
    for (const [key, practice] of Object.entries(religionKnowledge.practices)) {
        if (lowerQuery.includes(key.toLowerCase())) {
            results.push({
                type: 'practice',
                key: key,
                data: practice
            });
        }
    }

    return results;
}

// Format religion information
function formatReligionInfo(religion) {
    let info = `**${religion.name}**\n\n`;
    
    if (religion.origin) info += `📍 **Nguồn gốc**: ${religion.origin}\n`;
    if (religion.founder) info += `👤 **Người sáng lập**: ${religion.founder}\n`;
    if (religion.followers) info += `👥 **Số tín đồ**: ${religion.followers}\n`;
    if (religion.mainRegions) info += `🌍 **Khu vực chính**: ${religion.mainRegions}\n\n`;
    
    if (religion.keyBeliefs && religion.keyBeliefs.length > 0) {
        info += `**Giáo lý chính**:\n`;
        religion.keyBeliefs.forEach(belief => {
            info += `• ${belief}\n`;
        });
        info += `\n`;
    }
    
    if (religion.practices && religion.practices.length > 0) {
        info += `**Thực hành**:\n`;
        religion.practices.forEach(practice => {
            info += `• ${practice}\n`;
        });
        info += `\n`;
    }
    
    if (religion.texts && religion.texts.length > 0) {
        info += `**Kinh sách**: ${religion.texts.join(', ')}\n\n`;
    }
    
    if (religion.branches && religion.branches.length > 0) {
        info += `**Các nhánh**: ${religion.branches.join(', ')}\n`;
    }
    
    return info;
}

