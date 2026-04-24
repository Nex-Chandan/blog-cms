# Blog CMS — Backend API

A Blog Content Management System built with Node.js, Express, and MongoDB. Admins can create, edit, and delete blogs with image uploads and category filtering. Users can publicly browse and search blogs.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Image Upload | Cloudinary + Multer |
| Password Hashing | bcryptjs |

---

## Project Structure

```
backend/
├── controllers/
│   ├── authController.js       # Register, Login, Get Me
│   ├── blogController.js       # Blog CRUD + Admin Stats
│   └── categoryController.js   # Category CRUD
├── models/
│   ├── User.js                 # User schema (role: user/admin)
│   ├── Blog.js                 # Blog schema (soft delete, slug)
│   └── Category.js             # Category schema
├── routes/
│   ├── authRoutes.js           # /auth/*
│   ├── blogRoutes.js           # /blogs/*
│   └── categoryRoutes.js       # /categories/*
├── middleware/
│   ├── authMiddleware.js       # JWT verify
│   └── adminMiddleware.js      # Admin role check
├── services/
│   └── blogService.js          # Blog business logic
├── utils/
│   ├── cloudinary.js           # Cloudinary + Multer config
│   └── errorHandler.js         # AppError class + global handler
├── .env.example
├── package.json
└── server.js
```

---

## Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/blog-cms.git
cd blog-cms/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

`.env.example` ko copy karke `.env` banao:

```bash
cp .env.example .env
```

`.env` file mein ye values fill karo:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blogcms
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Server start karo

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server `http://localhost:5000` pe run karega.

---

## Authentication

JWT Bearer Token use hota hai. Login ke baad token ko har protected request mein bhejo:

```
Authorization: Bearer <your_token>
```

### User Roles

| Role | Access |
|------|--------|
| `user` | Public blogs read kar sakta hai |
| `admin` | Blog create/edit/delete + categories manage |

---

## API Endpoints

### Auth Routes — `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Naya user register karo |
| POST | `/auth/login` | None | Login karo, token milega |
| GET | `/auth/me` | Token | Apni profile dekho |

---

### Blog Routes — `/blogs`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/blogs` | None | Sab blogs fetch karo |
| GET | `/blogs/:id` | None | Single blog fetch karo |
| POST | `/blogs` | Admin | Naya blog banao |
| PUT | `/blogs/:id` | Admin | Blog update karo |
| DELETE | `/blogs/:id` | Admin | Blog delete karo (soft) |
| GET | `/blogs/admin/stats` | Admin | Total users + blogs count |

#### Query Parameters (GET `/blogs`)

| Param | Example | Description |
|-------|---------|-------------|
| `search` | `?search=react` | Title se search karo |
| `tag` | `?tag=nodejs` | Tag se filter karo |
| `category` | `?category=64a1b2...` | Category ID se filter karo |
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=5` | Per page blogs (default: 10) |

---

### Category Routes — `/categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | None | Sab categories fetch karo |
| POST | `/categories` | Admin | Nayi category banao |
| DELETE | `/categories/:id` | Admin | Category delete karo |

---

## Image Upload

Blog create/update karte waqt `multipart/form-data` use karo:

```
POST /blogs
Content-Type: multipart/form-data

title        = "My Blog Post"
content      = "<p>Blog content here</p>"
category     = "64a1b2c3d4e5f6a7b8c9d0e1"
tags         = ["react", "nodejs"]
coverImage   = <file>
```

Note: `Content-Type: application/json` mat bhejo jab image attach ho — browser automatically `multipart/form-data` set karta hai.

---

## Request & Response Examples

### Register
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Login
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "64a1...", "name": "John Doe", "role": "user" }
}
```

### Get All Blogs (with filters)
```
GET /blogs?category=64a1b2c3&search=react&page=1&limit=10
```

### Create Category
```json
POST /categories
Authorization: Bearer <admin_token>
{
  "title": "Technology"
}
```

---

## Error Response Format

Saare errors ek consistent format mein aate hain:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request — missing/invalid fields |
| 401 | Unauthorized — token missing ya expired |
| 403 | Forbidden — admin access required |
| 404 | Not Found — resource exist nahi karta |
| 500 | Server Error — unexpected failure |

---

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render / AWS |
| Database | MongoDB Atlas |
| Images | Cloudinary |

### Render pe deploy karne ke liye

1. `package.json` mein start script check karo: `"start": "node server.js"`
2. Environment variables Render dashboard mein add karo
3. `MONGO_URI` mein Atlas connection string use karo

---

## Available Scripts

```bash
npm run dev    # Nodemon se development server
npm start      # Production server
```

---

## Author

Blog CMS Project
