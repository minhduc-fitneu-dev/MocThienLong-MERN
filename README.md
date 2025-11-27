```md
# 🌳 Mộc Thiên Long – Fullstack E-commerce Platform (MERN)

A complete e-commerce web application built with the **MERN stack** (MongoDB, ExpressJS, ReactJS, NodeJS) featuring a modern UI, secure authentication, role-based admin panel, product management, order tracking, and Cloudinary image upload.

This project simulates a real-world online wood-art store with multi-level categories, cart system, search filters, wishlist, and full admin dashboard.

---

## 🚀 Technologies Used

### **Frontend (client)**
- ReactJS (Vite)
- Material UI (MUI)
- Context API
- React Router DOM
- Axios
- SwiperJS

### **Backend (server)**
- NodeJS + ExpressJS  
- MongoDB Atlas + Mongoose  
- RESTful API  
- JWT Authentication (Access + Refresh Token)  
- OTP Email Verification (Brevo / Gmail SMTP)  
- Multer & Cloudinary (image upload)  

### **Admin Panel**
- ReactJS (Vite)
- Material UI
- Protected Routes
- CRUD Dashboard

---

## 🏗️ System Architecture

```

Frontend (ReactJS)  →  Backend API (ExpressJS)  →  MongoDB Atlas
↑
Cloudinary (Images)

```

---

## ✨ Key Features

### 👤 User Features
- Register with OTP verification  
- Login / Logout with JWT  
- Update profile, address  
- Browse multi-level categories (Category → Sub → Third)  
- Product search, filtering, sorting  
- Add to cart, wishlist  
- Checkout and order history  
- Responsive UI  

### 🛒 Cart & Checkout
- Add/update/remove items  
- Auto-calculated totals  
- Address & shipping info  
- Order management  

### 🛠️ Admin Features
- Admin login with role-based access  
- Create / Update / Delete products  
- Upload multiple images (Cloudinary)  
- Manage categories with 3-level hierarchy  
- Order management  
- Dashboard with statistics  

---

## 📂 Folder Structure

```

MocThienLong-MERN/
│
├── client/            # ReactJS frontend
├── admin/             # Admin dashboard (ReactJS)
├── server/            # NodeJS backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── index.js
│
├── .gitignore
├── LICENSE
└── README.md

```

---

## 🔐 Authentication Flow

- User registers → receives OTP email  
- User verifies account → login enabled  
- Login returns:
  - Access Token (15–30 minutes)
  - Refresh Token (longer expiry)
- Auto-refresh token on expiration  
- Role-based access for Admin  

---

## ☁️ Image Upload (Cloudinary)

- Multer stores temp images  
- Controller uploads to Cloudinary  
- Secure URLs returned and saved in MongoDB  

---

## 📦 Installation

### 1️⃣ Clone repository
```

git clone [https://github.com/minhduc-fitneu-dev/MocThienLong-MERN.git](https://github.com/minhduc-fitneu-dev/MocThienLong-MERN.git)

```

### 2️⃣ Install dependencies

#### Install client
```

cd client
npm install
npm run dev

```

#### Install admin
```

cd admin
npm install
npm run dev

```

#### Install backend
```

cd server
npm install
npm run dev

```

---

## 🔧 Environment Variables

Create a `.env` file in **server/**:

```

PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_USER=xxxx
BREVO_PASS=xxxx
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

```

---

## 🖼️ Screenshots

(Add your screenshots here)
```

📌 Home Page
📌 Product Listing
📌 Product Details
📌 Cart & Checkout
📌 Admin Dashboard
📌 Category Management

```

---

## 📌 Author

**Vũ Minh Đức**  
Fullstack Developer – NEU  
GitHub: https://github.com/minhduc-fitneu-dev

---
```
