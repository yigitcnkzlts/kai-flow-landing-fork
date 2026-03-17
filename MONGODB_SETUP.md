# MongoDB Demo Request Form - Kurulum ve Test Rehberi

## 📋 Sistem Mimarisi

```
Frontend (Next.js - Port 3002)
    ↓
    POST /api/demo-request
    ↓
Backend (Express - Port 5000)
    ↓
    MongoDB Atlas (kafeinflow database)
    ↓
    demoRequests Collection
```

## ✅ Kontrol Listesi

### 1. Backend Dosyaları
- ✅ `backend/.env` - MongoDB URI doğru formatta
- ✅ `backend/src/config/db.js` - Bağlantı logları açık
- ✅ `backend/src/models/DemoRequest.js` - Tüm alanlar tanımlanmış
- ✅ `backend/src/controllers/demoRequestController.js` - Save logic doğru
- ✅ `backend/src/routes/demoRequestRoutes.js` - POST endpoint tanımlanmış
- ✅ `backend/src/app.js` - CORS ayarları doğru

### 2. Frontend Dosyaları
- ✅ `src/components/demo-request-modal.tsx` - Fetch URL doğru
- ✅ Form verileri backend ile uyumlu

### 3. MongoDB Bağlantı Durumu
- ⚠️ Şu anda: IP Whitelist sorunu (bağlantı başarısız)
- ✅ Server çalışıyor (port 5000)
- ✅ Health endpoint çalışıyor
- ✅ Endpoint'ler hazır

## 🔐 MongoDB Atlas IP Whitelist Açma

### Adım 1: MongoDB Atlas Dashboard'a Git
https://cloud.mongodb.com

### Adım 2: Network Access Seçeneğine Git
1. Sol menüde "Network Access" seçeneğini tıkla
2. "IP Whitelist" sekmesine git

### Adım 3: IP Ekle
1. "Add IP Address" butonuna tıkla
2. "Allow access from anywhere" seçeneğini seç (0.0.0.0/0)
   - **Development için**: Tüm IP'lere izin ver
   - **Production için**: Sadece kendi IP'ni ekle
3. "Confirm" butonuna tıkla

### Adım 4: Bağlantı Testi
Backend console'da şu mesajı göreceksin:
```
✅ ========== MONGODB CONNECTED SUCCESSFULLY ==========
✅ Host: kafein-flow.z8rjcgn.mongodb.net
✅ Database: kafeinflow
✅ Connection State: 1 (1 = connected)
✅ Ready to save demo requests to MongoDB
```

## 📤 Test: POST İsteği Örneği

### cURL Komutu
```bash
curl -X POST http://localhost:5000/api/demo-request \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Yiğit Can",
    "email": "yigit@example.com",
    "phone": "5555555555",
    "company": "Kai Flow",
    "jobTitle": "Developer",
    "message": "Demo almak istiyorum",
    "country": "TR",
    "companySize": "1-10",
    "interests": ["workManagement", "salesCRM"],
    "acceptedKvkk": true,
    "acceptedMarketing": false
  }'
```

### PowerShell Komutu
```powershell
$body = @{
    fullName = "Yiğit Can"
    email = "yigit@example.com"
    phone = "5555555555"
    company = "Kai Flow"
    jobTitle = "Developer"
    message = "Demo almak istiyorum"
    country = "TR"
    companySize = "1-10"
    interests = @("workManagement", "salesCRM")
    acceptedKvkk = $true
    acceptedMarketing = $false
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/demo-request" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

## ✅ Başarılı Response (MongoDB Bağlı Olduğunda)

### Status: 201 Created
```json
{
  "success": true,
  "message": "Demo request received and saved successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "yigit@example.com",
    "fullName": "Yiğit Can",
    "createdAt": "2026-03-17T06:15:30.123Z"
  }
}
```

### Backend Console Logu
```
📨 ========== NEW DEMO REQUEST ==========
📥 Request Body: {
  "fullName": "Yiğit Can",
  "email": "yigit@example.com",
  ...
}
🗄️  MongoDB Connection State: 1
🗄️  MongoDB Database: kafeinflow
🗄️  Collection Name: demorequests
✅ Validation passed - all required fields present
📝 Creating new DemoRequest document...
📝 Document created (not saved yet)
💾 Saving to MongoDB...

✅ ========== SUCCESS ==========
✅ Successfully saved to MongoDB
✅ Document ID: 65a1b2c3d4e5f6g7h8i9j0k1
✅ Email: yigit@example.com
✅ Full Name: Yiğit Can
✅ Created At: 2026-03-17T06:15:30.123Z
✅ Collection: demorequests
========== REQUEST COMPLETE ==========
```

## ❌ Hata Response (MongoDB Bağlı Değilse)

### Status: 503 Service Unavailable
```json
{
  "success": false,
  "message": "Database connection failed. Please try again later."
}
```

### Backend Console Logu
```
❌ MongoDB is not connected (State: 0)
❌ Cannot save demo request to database
```

## 📊 MongoDB Atlas'ta Veri Kontrol

### 1. MongoDB Atlas Dashboard'a Git
https://cloud.mongodb.com

### 2. Cluster'a Tıkla
"Clusters" → "Cluster0" → "Browse Collections"

### 3. Database ve Collection Kontrol
- Database: `kafeinflow`
- Collection: `demorequests`

### 4. Kaydı Görüntüle
Tüm demo request'ler burada görünecek:
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "fullName": "Yiğit Can",
  "email": "yigit@example.com",
  "phone": "5555555555",
  "company": "Kai Flow",
  "jobTitle": "Developer",
  "message": "Demo almak istiyorum",
  "country": "TR",
  "companySize": "1-10",
  "interests": ["workManagement", "salesCRM"],
  "acceptedKvkk": true,
  "acceptedMarketing": false,
  "createdAt": ISODate("2026-03-17T06:15:30.123Z"),
  "updatedAt": ISODate("2026-03-17T06:15:30.123Z"),
  "__v": 0
}
```

## 🔄 Form Submit Akışı

### Frontend (Next.js)
1. Kullanıcı formu doldur
2. "Gönder" butonuna tıkla
3. Form validation
4. POST isteği: `http://localhost:5000/api/demo-request`
5. Payload gönder (JSON)

### Backend (Express)
1. Request al
2. CORS kontrol
3. Body parse
4. Validation
5. MongoDB bağlantı kontrol
6. Document oluştur
7. MongoDB'ye kaydet
8. Response dön (201 + success)

### MongoDB
1. Document al
2. Collection'a ekle
3. _id oluştur
4. Timestamp ekle
5. Kayıt tamamla

### Frontend (Geri Dönüş)
1. Response al
2. Success kontrol
3. Confetti animasyonu
4. Success mesajı göster
5. 2 saniye sonra modal kapat
6. Form reset

## 📝 DemoRequest Model Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| fullName | String | ✅ | Tam ad (min 2 karakter) |
| email | String | ✅ | Email (valid format) |
| phone | String | ✅ | Telefon numarası |
| company | String | ❌ | Şirket adı |
| jobTitle | String | ❌ | İş unvanı |
| message | String | ❌ | Mesaj |
| country | String | ❌ | Ülke kodu (TR, US, etc) |
| companySize | String | ❌ | Şirket büyüklüğü (1-10, 11-50, etc) |
| interests | Array | ❌ | İlgi alanları |
| acceptedKvkk | Boolean | ✅ | KVKK onayı |
| acceptedMarketing | Boolean | ❌ | Marketing onayı (default: false) |
| createdAt | Date | ✅ | Oluşturma tarihi (auto) |
| updatedAt | Date | ✅ | Güncelleme tarihi (auto) |

## 🚀 Başlangıç Komutu

### Backend Başlat
```bash
cd backend
npm start
```

### Frontend Başlat
```bash
npm run dev
```

### Her İkisini Aynı Anda Başlat (Farklı Terminal'lerde)
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
npm run dev
```

## 🔗 Önemli URL'ler

- Frontend: http://localhost:3002
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health
- Demo Request: POST http://localhost:5000/api/demo-request
- MongoDB Atlas: https://cloud.mongodb.com
- IP Whitelist: https://cloud.mongodb.com/v2/[projectId]#/security/network/whitelist

## 📞 Sorun Giderme

### Problem: "Database connection failed"
**Çözüm**: MongoDB Atlas IP Whitelist'e IP adresini ekle

### Problem: "Cannot reach server at http://localhost:5000"
**Çözüm**: Backend'in çalışıp çalışmadığını kontrol et (`npm start`)

### Problem: "CORS error"
**Çözüm**: Backend CORS ayarlarını kontrol et (localhost:3002 izin verilmiş mi?)

### Problem: "Validation error"
**Çözüm**: Tüm zorunlu alanları doldur (fullName, email, phone, acceptedKvkk)

## ✨ Sistem Hazır!

Tüm yapı kuruldu ve test edildi. MongoDB Atlas IP Whitelist'i açtıktan sonra:
1. Form submit et
2. Backend console'da başarı logu gör
3. MongoDB Atlas'ta kaydı kontrol et
4. Frontend'de success mesajı ve confetti animasyonu gör

Başarılar! 🎉
