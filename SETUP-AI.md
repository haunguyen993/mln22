# 🚀 Hướng dẫn Tích hợp AI cho Article Generator

## ⚠️ Lưu ý quan trọng

**Vercel không thể chạy model local** vì:
- Vercel là serverless platform (không có GPU/CPU mạnh)
- Model local cần tài nguyên lớn
- **Giải pháp**: Sử dụng AI API từ các provider

## ✅ Giải pháp được đề xuất

### Option 1: OpenAI API (Khuyến nghị - Dễ setup nhất)

#### Bước 1: Lấy API Key
1. Truy cập: https://platform.openai.com/
2. Đăng ký/Đăng nhập
3. Vào: https://platform.openai.com/api-keys
4. Tạo API key mới
5. Copy API key (dạng: `sk-...`)

#### Bước 2: Thêm vào Vercel
1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**
4. Thêm biến mới:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-...` (API key bạn vừa copy)
   - **Environment**: Production, Preview, Development (chọn tất cả)
5. Click **Save**
6. **Redeploy** project (Vercel sẽ tự động deploy lại)

#### Bước 3: Cài đặt package
```bash
npm install openai
```

#### Chi phí:
- GPT-3.5-turbo: ~$0.002 cho 1 bài viết 1000 từ
- GPT-4: ~$0.03 cho 1 bài viết 1000 từ
- Có $5 credit miễn phí khi đăng ký mới

---

### Option 2: Anthropic Claude (Chất lượng cao)

#### Bước 1: Lấy API Key
1. Truy cập: https://console.anthropic.com/
2. Đăng ký/Đăng nhập
3. Tạo API key
4. Copy API key (dạng: `sk-ant-...`)

#### Bước 2: Thêm vào Vercel
- Tương tự như OpenAI
- **Name**: `ANTHROPIC_API_KEY`
- **Value**: `sk-ant-...`

#### Bước 3: Cài đặt
```bash
npm install @anthropic-ai/sdk
```

---

### Option 3: Hugging Face (Miễn phí - Có giới hạn)

#### Bước 1: Lấy API Key
1. Truy cập: https://huggingface.co/
2. Đăng ký/Đăng nhập
3. Vào: https://huggingface.co/settings/tokens
4. Tạo Access Token
5. Copy token (dạng: `hf_...`)

#### Bước 2: Thêm vào Vercel
- **Name**: `HUGGINGFACE_API_KEY`
- **Value**: `hf_...`

**⚠️ Lưu ý**: Hugging Face free tier có rate limits và cần chọn model phù hợp cho tiếng Việt.

---

## 📦 Cài đặt Dependencies

Sau khi chọn provider, cài đặt package tương ứng:

```bash
# Nếu dùng OpenAI
npm install openai

# Nếu dùng Anthropic
npm install @anthropic-ai/sdk

# Hoặc cài tất cả
npm install openai @anthropic-ai/sdk
```

## 🚀 Deploy lên Vercel

### Cách 1: Deploy qua Vercel CLI
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy production
vercel --prod
```

### Cách 2: Deploy qua GitHub
1. Push code lên GitHub
2. Vào Vercel Dashboard
3. Click **Add New Project**
4. Import từ GitHub
5. Vercel sẽ tự động detect và deploy

## 🧪 Test Local

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Chạy local development server
vercel dev
```

Sau đó test API:
```bash
curl -X POST http://localhost:3000/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "religion",
    "religion": "Phật giáo",
    "style": "informative"
  }'
```

## 📊 So sánh các Options

| Provider | Chi phí | Chất lượng | Tốc độ | Tiếng Việt | Khuyến nghị |
|----------|---------|------------|--------|------------|-------------|
| **OpenAI GPT-3.5** | ~$0.002/1K từ | ⭐⭐⭐⭐ | ⚡⚡⚡ | ✅ Tốt | ✅ **Tốt nhất** |
| **OpenAI GPT-4** | ~$0.03/1K từ | ⭐⭐⭐⭐⭐ | ⚡⚡ | ✅ Rất tốt | ✅ Chất lượng cao |
| **Anthropic Claude** | ~$0.015/1K từ | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | ✅ Tốt | ✅ Tốt |
| **Hugging Face** | Miễn phí | ⭐⭐⭐ | ⚡ | ⚠️ Cần model phù hợp | ⚠️ Có giới hạn |

## 💰 Chi phí ước tính

Với **1000 bài viết/tháng** (mỗi bài ~1000 từ):
- **GPT-3.5**: ~$2/tháng
- **GPT-4**: ~$30/tháng
- **Claude**: ~$15/tháng
- **Hugging Face**: Miễn phí (nhưng có rate limits)

## 🔧 Cấu trúc Files

```
/
├── api/
│   └── generate-article.js    # Vercel Serverless Function
├── article-generator.js        # Frontend (đã update)
├── vercel.json                 # Vercel config
├── package.json                # Dependencies
└── README-AI-SETUP.md          # Hướng dẫn này
```

## ✅ Checklist Setup

- [ ] Chọn AI provider (khuyến nghị: OpenAI)
- [ ] Lấy API key từ provider
- [ ] Thêm API key vào Vercel Environment Variables
- [ ] Cài đặt npm packages
- [ ] Test local với `vercel dev`
- [ ] Deploy lên Vercel
- [ ] Test trên production

## 🐛 Troubleshooting

### Lỗi: "API key not found"
✅ **Giải pháp**: 
- Kiểm tra Environment Variables trong Vercel
- Đảm bảo đã redeploy sau khi thêm biến
- Kiểm tra tên biến có đúng không

### Lỗi: "Rate limit exceeded"
✅ **Giải pháp**:
- Hugging Face free tier có giới hạn
- Nên dùng OpenAI hoặc Anthropic cho production
- Hoặc upgrade Hugging Face plan

### Lỗi: "Module not found"
✅ **Giải pháp**:
- Chạy `npm install` để cài dependencies
- Kiểm tra `package.json` có đúng packages không

### API không hoạt động trên Vercel
✅ **Giải pháp**:
- Kiểm tra logs trong Vercel Dashboard
- Đảm bảo file `api/generate-article.js` tồn tại
- Kiểm tra `vercel.json` config

## 🎯 Kết quả mong đợi

Sau khi setup xong:
- ✅ Article Generator sẽ tự động gọi AI API
- ✅ Bài viết được tạo bởi AI thực sự (không phải rule-based)
- ✅ Chất lượng bài viết cao hơn nhiều
- ✅ Tự động fallback về rule-based nếu API lỗi

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Vercel Function Logs
2. Browser Console
3. Network tab để xem API calls

