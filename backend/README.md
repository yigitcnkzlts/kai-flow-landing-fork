# Kai Flow Backend

Node.js + Express + MongoDB Atlas tabanlı demo talep API'si.

## Kurulum

```bash
npm install
```

## Çalıştırma

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Demo Request
```
POST /api/demo-request
GET /api/demo-request
GET /api/demo-request/:id
```

## Request Body Örneği

```json
{
  "fullName": "Yiğit Can",
  "email": "test@mail.com",
  "phone": "05555555555",
  "company": "Kai Flow",
  "jobTitle": "Developer",
  "message": "Demo almak istiyorum",
  "country": "Türkiye",
  "companySize": "1-10",
  "interests": ["softwareDevelopment", "productManagement"],
  "acceptedKvkk": true,
  "acceptedMarketing": false
}
```

## Environment Variables

`.env` dosyasında aşağıdaki değişkenleri tanımla:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Klasör Yapısı

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── DemoRequest.js
│   ├── controllers/
│   │   └── demoRequestController.js
│   ├── routes/
│   │   └── demoRequestRoutes.js
│   └── app.js
├── server.js
├── package.json
├── .env
└── .gitignore
```

## Teknolojiler

- Node.js
- Express
- Mongoose
- MongoDB Atlas
- CORS
- dotenv
