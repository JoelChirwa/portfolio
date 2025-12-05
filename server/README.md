# 🚀 Portfolio Backend Server

Express.js backend with MongoDB, JWT authentication, and admin panel APIs.

## 📦 Features

- 🔐 **JWT Authentication** - Secure admin login
- 🗄️ **MongoDB** - Database for projects and messages
- 📧 **Contact Form** - Email integration with Nodemailer
- 📁 **Projects API** - Full CRUD operations
- 📨 **Messages Management** - Contact submissions
- 🔒 **Protected Routes** - Admin-only endpoints

---

## 🛠️ Installation

```bash
npm install
```

---

## ⚙️ Configuration

1. **Copy environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your settings:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your-random-secret-key
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@portfolio.com
   ADMIN_PASSWORD=admin123
   ```

---

## 🚀 Running the Server

### Development:

```bash
npm run dev
```

### Production:

```bash
npm start
```

Server runs on: **http://localhost:5000**

---

## 👤 Create Admin User

**Quick method:**

```bash
npm run seed:admin
```

This creates an admin user with credentials from `.env`

**Manual method:**

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'
```

---

## 📡 API Endpoints

### **Authentication**

- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Login
- `GET /api/admin/me` - Get profile (protected)
- `POST /api/admin/logout` - Logout (protected)

### **Projects**

- `GET /api/projects` - List all projects (public)
- `GET /api/projects/:id` - Get single project (public)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### **Contact Submissions**

- `GET /api/contact-submissions` - List submissions (protected)
- `GET /api/contact-submissions/:id` - Get submission (protected)
- `PUT /api/contact-submissions/:id` - Update status (protected)
- `DELETE /api/contact-submissions/:id` - Delete (protected)
- `GET /api/contact-submissions/stats/overview` - Stats (protected)

### **Contact Form**

- `POST /api/contact` - Submit contact form (public)

---

## 📂 Project Structure

```
server/
├── src/
│   ├── models/
│   │   ├── Admin.js              # Admin user model
│   │   ├── Project.js            # Project model
│   │   └── ContactSubmission.js  # Message model
│   ├── routes/
│   │   ├── admin.js              # Auth routes
│   │   ├── projects.js           # Projects CRUD
│   │   ├── contactSubmissions.js # Messages management
│   │   └── contact.js            # Contact form
│   ├── middleware/
│   │   └── auth.js               # JWT middleware
│   └── index.js                  # Server entry
├── seedUser.js                   # Admin seed script
├── .env.example                  # Environment template
└── package.json
```

---

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Protected routes with middleware
- CORS configured
- Environment variables for secrets

---

## 📧 Email Configuration

**Gmail (Recommended for testing):**

1. Enable 2-Step Verification
2. Generate App Password
3. Add to `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

**Alternative services:**

- Mailtrap - https://mailtrap.io
- SendGrid - https://sendgrid.com
- Mailgun - https://mailgun.com

---

## 🗄️ Database

**Local MongoDB:**

```bash
mongod
```

**MongoDB Atlas (Cloud):**

1. Create cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

---

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run seed:admin` - Create admin user

---

## 🛠️ Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email sending
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **cookie-parser** - Cookie parsing

---

## 🧪 Testing

**Check server status:**

```bash
curl http://localhost:5000
```

**Login test:**

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🚀 Deployment

### **Render / Heroku:**

1. Set environment variables
2. Connect GitHub repo
3. Deploy!

### **Environment variables needed:**

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `EMAIL_USER` (optional)
- `EMAIL_PASS` (optional)

---

## 📚 Documentation

- [Admin Setup Guide](../ADMIN_USER_SETUP.md)
- [API Documentation](../ADMIN_SETUP.md)
- [Main README](../README.md)

---

## 🆘 Troubleshooting

**MongoDB Connection Error:**

- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`

**JWT Error:**

- Ensure `JWT_SECRET` is set
- Check token format in requests

**CORS Error:**

- Update `CLIENT_URL` in `.env`
- Verify frontend URL

---

Made with ❤️ for portfolio management
