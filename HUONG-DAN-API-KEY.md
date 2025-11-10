# 🔑 Hướng dẫn Cấu hình API Key cho AI Article Generator

## ⚡ Hướng dẫn Nhanh (3 bước)

### Bước 1: Lấy API Key

**Option 1: OpenAI (Khuyến nghị - Dễ nhất)**
1. Truy cập: https://platform.openai.com/
2. Đăng ký/Đăng nhập
3. Vào: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy API key (dạng: `sk-...`)
6. 💰 Có $5 credit miễn phí khi đăng ký mới

**Option 2: Anthropic Claude**
1. Truy cập: https://console.anthropic.com/
2. Đăng ký/Đăng nhập
3. Tạo API key
4. Copy API key (dạng: `sk-ant-...`)

**Option 3: Hugging Face (Miễn phí)**
1. Truy cập: https://huggingface.co/
2. Đăng ký/Đăng nhập
3. Vào: https://huggingface.co/settings/tokens
4. Tạo Access Token
5. Copy token (dạng: `hf_...`)
6. ⚠️ Có rate limits (giới hạn số lần gọi)

---

### Bước 2: Thêm vào Vercel

1. **Vào Vercel Dashboard**
   - Truy cập: https://vercel.com/dashboard
   - Chọn project của bạn

2. **Vào Settings → Environment Variables**
   - Click vào project
   - Click tab "Settings"
   - Click "Environment Variables" ở menu bên trái

3. **Thêm API Key**
   - **Key**: `OPENAI_API_KEY` (hoặc `ANTHROPIC_API_KEY`, `HUGGINGFACE_API_KEY`)
   - **Value**: Paste API key bạn đã copy
   - **Environment**: Chọn tất cả 3 options:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **"Save"**

4. **Redeploy Project**
   - Vào tab "Deployments"
   - Click "..." ở deployment mới nhất
   - Click "Redeploy"
   - Hoặc push code mới lên GitHub (Vercel sẽ auto deploy)

---

### Bước 3: Kiểm tra

1. Vào website của bạn
2. Thử tạo một bài viết bằng AI Article Generator
3. Nếu thấy bài viết được tạo bởi AI (không còn thông báo cấu hình), nghĩa là đã thành công! ✅

---

## 📊 So sánh các Options

| Provider | Chi phí | Chất lượng | Tốc độ | Khuyến nghị |
|----------|---------|------------|--------|-------------|
| **OpenAI GPT-3.5** | ~$0.002/1K từ | ⭐⭐⭐⭐ | ⚡⚡⚡ | ✅ **Tốt nhất** |
| **OpenAI GPT-4** | ~$0.03/1K từ | ⭐⭐⭐⭐⭐ | ⚡⚡ | ✅ Chất lượng cao |
| **Anthropic Claude** | ~$0.015/1K từ | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | ✅ Tốt |
| **Hugging Face** | Miễn phí | ⭐⭐⭐ | ⚡ | ⚠️ Có giới hạn |

---

## 💰 Chi phí ước tính

Với **1000 bài viết/tháng** (mỗi bài ~1000 từ):
- **GPT-3.5**: ~$2/tháng
- **GPT-4**: ~$30/tháng  
- **Claude**: ~$15/tháng
- **Hugging Face**: Miễn phí (nhưng có rate limits)

---

## 🐛 Troubleshooting

### ❌ Lỗi: "API key not found"
**Giải pháp:**
- Kiểm tra lại Environment Variables trong Vercel
- Đảm bảo đã chọn đúng environment (Production, Preview, Development)
- Đảm bảo đã redeploy sau khi thêm biến

### ❌ Lỗi: "Rate limit exceeded"
**Giải pháp:**
- Hugging Face free tier có giới hạn
- Nên dùng OpenAI hoặc Anthropic cho production
- Hoặc upgrade Hugging Face plan

### ❌ Lỗi: "Invalid API key"
**Giải pháp:**
- Kiểm tra lại API key có đúng không
- Đảm bảo không có khoảng trắng thừa
- Thử tạo API key mới

### ❌ Vẫn thấy thông báo "Cấu hình API key"
**Giải pháp:**
- Đảm bảo đã redeploy project
- Kiểm tra logs trong Vercel Dashboard → Functions
- Kiểm tra tên biến môi trường có đúng không

---

## 📝 Lưu ý quan trọng

1. **Bảo mật API Key:**
   - ⚠️ KHÔNG commit API key vào Git
   - ⚠️ KHÔNG chia sẻ API key công khai
   - ✅ Chỉ thêm vào Vercel Environment Variables

2. **Sau khi thêm API key:**
   - ✅ Bắt buộc phải **Redeploy** để áp dụng
   - ✅ Có thể mất 1-2 phút để deploy xong

3. **Nếu không có API key:**
   - ✅ Website vẫn hoạt động bình thường
   - ✅ AI Article Generator sẽ dùng chế độ rule-based (cơ bản)
   - ✅ Có thể thêm API key sau bất cứ lúc nào

---

## 🎯 Kết quả mong đợi

Sau khi setup xong:
- ✅ AI Article Generator sẽ tự động gọi AI API
- ✅ Bài viết được tạo bởi AI thực sự (không phải rule-based)
- ✅ Chất lượng bài viết cao hơn nhiều
- ✅ Tự động fallback về rule-based nếu API lỗi

---

## 📞 Cần hỗ trợ?

Nếu gặp vấn đề:
1. Kiểm tra Vercel Function Logs (Dashboard → Functions)
2. Kiểm tra Browser Console (F12)
3. Kiểm tra Network tab để xem API calls

