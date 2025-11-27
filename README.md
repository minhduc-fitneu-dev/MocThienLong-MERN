# 🌳 Mộc Thiên Long – Fullstack E-commerce Platform (MERN)

A full-featured e-commerce web application built with the **MERN stack** (MongoDB, ExpressJS, ReactJS, NodeJS).  
The platform includes a modern user interface, admin dashboard, multi-level category system, product management, secure authentication, and Cloudinary image upload.

This project simulates a real-world online store for wooden art and handcrafted products.

---

## 🚀 Technologies Used

### **Frontend (client)**
- ReactJS (Vite)
- Material UI (MUI)
- React Router DOM
- Context API
- Axios
- SwiperJS

### **Admin Panel**
- ReactJS (Vite)
- Protected Routes
- Material UI
- Dashboard UI
- CRUD features

### **Backend (server)**
- NodeJS + ExpressJS
- MongoDB Atlas + Mongoose
- RESTful API
- JWT Authentication (Access Token + Refresh Token)
- OTP Email Verification (Brevo / Gmail SMTP)
- Multer + Cloudinary (Image upload)
- Middleware structure (auth, adminAuth)

---

## 🏗️ System Architecture

Frontend (Client - ReactJS)
↓
Backend API (NodeJS - ExpressJS)
↓
MongoDB Atlas (Database)
↑
Cloudinary (Image Hosting)

---

## ✨ Key Features

### 👤 User Features
- Register with OTP email verification
- Login / Logout with JWT
- Refresh Token (auto-renew access token)
- Update personal profile + address
- Browse multi-level categories: Category → Sub → Third
- Search, filter, sort products
- Add to cart, wishlist
- Checkout and order history
- Responsive UI for mobile & desktop

---

### 🛒 Cart & Checkout
- Add/update/remove items in cart
- Auto-calculated totals
- Save customer address & contact details
- Order creation + tracking

---

### 🛠️ Admin Features
- Admin login with role-based authorization
- CRUD Products (title, price, images, description…)
- Cloudinary image upload (multi-image support)
- Manage categories (3-level structure)
- Manage orders & status
- Dashboard overview + statistics

---

## 📂 Folder Structure
MocThienLong-MERN/
│
├── client/ # ReactJS customer frontend
├── admin/ # Admin dashboard (ReactJS)
├── server/ # NodeJS backend API
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── config/
│ ├── middlewares/
│ └── index.js
│
├── .gitignore
├── LICENSE
└── README.md

---

## 🔐 Authentication Flow (JWT + OTP)

1. User registers → system sends OTP email  
2. User verifies OTP → activates account  
3. Login returns:
   - Access Token (short-lived)
   - Refresh Token (long-lived)
4. Auto-refresh when access token expires  
5. Admin accounts have elevated privileges  

---

## ☁️ Cloudinary Image Upload Flow

1. User/Admin uploads image → Multer stores temporarily  
2. Server uploads file to Cloudinary  
3. Cloudinary returns secure URL  
4. URL saved into MongoDB product document  

---

## 📦 Installations

### 1️⃣ Clone the repository
git clone https://github.com/minhduc-fitneu-dev/MocThienLong-MERN.git

---

## ▶️ Client Setup
cd client
npm install
npm run dev

## ▶️ Admin Setup
cd admin
npm install
npm run dev

---

## ▶️ Server Setup
cd server
npm install
npm run dev

---

## 🔧 Environment Variables

Create a `.env` file inside **server/**:
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_token
REFRESH_TOKEN_SECRET=your_refresh_token

BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_USER=xxxx
BREVO_PASS=xxxx

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx



---

## 📌 Author

**Vũ Minh Đức**  
Fullstack Developer – NEU  
GitHub: https://github.com/minhduc-fitneu-dev  

---

## 📄 License
MIT License




