# Hướng dẫn Tích hợp AI cho Article Generator

## Tổng quan

Article Generator hiện hỗ trợ tích hợp với các AI models để tạo bài viết chất lượng cao. Bạn có thể chọn một trong các options sau:

## Option 1: OpenAI (Khuyến nghị - Chất lượng tốt nhất)

### Bước 1: Lấy API Key
1. Đăng ký tại https://platform.openai.com/
2. Tạo API key tại https://platform.openai.com/api-keys
3. Copy API key

### Bước 2: Thêm vào Vercel
1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Thêm biến: `OPENAI_API_KEY` = `sk-...` (API key của bạn)
3. Redeploy project

### Bước 3: Cài đặt dependencies
```bash
npm install openai
```

## Option 2: Anthropic Claude (Chất lượng cao)

### Bước 1: Lấy API Key
1. Đăng ký tại https://console.anthropic.com/
2. Tạo API key
3. Copy API key

### Bước 2: Thêm vào Vercel
1. Vào Vercel Dashboard → Environment Variables
2. Thêm biến: `ANTHROPIC_API_KEY` = `sk-ant-...`
3. Redeploy project

### Bước 3: Cài đặt dependencies
```bash
npm install @anthropic-ai/sdk
```

## Option 3: Hugging Face (Miễn phí - Có giới hạn)

### Bước 1: Lấy API Key
1. Đăng ký tại https://huggingface.co/
2. Tạo Access Token tại https://huggingface.co/settings/tokens
3. Copy token

### Bước 2: Thêm vào Vercel
1. Vào Vercel Dashboard → Environment Variables
2. Thêm biến: `HUGGINGFACE_API_KEY` = `hf_...`
3. Redeploy project

**Lưu ý**: Hugging Face free tier có rate limits. Cần chọn model phù hợp cho tiếng Việt.

## Option 4: Sử dụng Vercel AI SDK (Khuyến nghị cho Vercel)

### Cài đặt
```bash
npm install ai @ai-sdk/openai
```

### Tạo API route mới: `api/generate-article-ai.js`
```javascript
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export default async function handler(req, res) {
  const { topic, religion, customTopic, style } = req.body;
  
  const { text } = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt: buildPrompt(topic, religion, customTopic, style),
  });

  res.json({ success: true, article: text });
}
```

## So sánh các Options

| Option | Chi phí | Chất lượng | Tốc độ | Khuyến nghị |
|--------|---------|------------|--------|-------------|
| OpenAI GPT-3.5 | ~$0.002/1K tokens | ⭐⭐⭐⭐ | Nhanh | ✅ Tốt nhất |
| OpenAI GPT-4 | ~$0.03/1K tokens | ⭐⭐⭐⭐⭐ | Trung bình | ✅ Chất lượng cao |
| Anthropic Claude | ~$0.015/1K tokens | ⭐⭐⭐⭐⭐ | Nhanh | ✅ Tốt |
| Hugging Face | Miễn phí | ⭐⭐⭐ | Chậm | ⚠️ Có giới hạn |

## Cấu trúc File

```
/
├── api/
│   └── generate-article.js    # Vercel Serverless Function
├── article-generator.js        # Frontend logic
├── vercel.json                 # Vercel config
└── package.json                # Dependencies
```

## Testing Locally

1. Cài đặt Vercel CLI:
```bash
npm i -g vercel
```

2. Chạy local:
```bash
vercel dev
```

3. Test API:
```bash
curl -X POST http://localhost:3000/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{"topic":"religion","religion":"Phật giáo","style":"informative"}'
```

## Troubleshooting

### Lỗi: "API key not found"
- Kiểm tra Environment Variables trong Vercel
- Đảm bảo đã redeploy sau khi thêm biến môi trường

### Lỗi: "Rate limit exceeded"
- Hugging Face free tier có giới hạn
- Nên dùng OpenAI hoặc Anthropic cho production

### Lỗi: "Model not available"
- Kiểm tra model name trong code
- Đảm bảo API key có quyền truy cập model

## Chi phí ước tính

- **OpenAI GPT-3.5**: ~$0.002 cho 1 bài viết 1000 từ
- **OpenAI GPT-4**: ~$0.03 cho 1 bài viết 1000 từ
- **Anthropic Claude**: ~$0.015 cho 1 bài viết 1000 từ

Với 1000 bài viết/tháng: ~$2-30 tùy model.

## Fallback

Nếu không có API key, hệ thống sẽ tự động fallback về rule-based generation (như hiện tại).

