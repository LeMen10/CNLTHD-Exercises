# 🔧 CRUD Node.js với MongoDB

Dự án này là một ứng dụng CRUD đơn giản sử dụng **Node.js**, **Express**, **MongoDB** cho phần backend và **React** cho phần frontend.

---

## 📁 Cấu trúc thư mục

```
.
├── backend/       # API sử dụng Node.js, Express và MongoDB
└── frontend/      # Giao diện người dùng (React)
```

---

## 🚀 Cài đặt

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 🔗 Cấu hình MongoDB

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
JWT_SECRET = dm9sZW1lbjMxMjE0MTAzMTlAQEBA
URI_MONGODB_CLOUD = mongodb+srv://menvo100vo:h3eKSP9aB6bSp1kd@cluster0.et2eh.mongodb.net/user-management?retryWrites=true&w=majority&appName=Cluster0
BASE_URL_REACTJS = http://localhost:3000/
```

> Bạn có thể thay đổi `user-management` theo tên cơ sở dữ liệu mong muốn.

---

## ▶️ Chạy dự án

### Chạy Backend

```bash
cd backend
npm start
```

> Mặc định chạy tại: `http://localhost:5460`

### Chạy Frontend

Tạo file `.env` trong thư mục `frontend` với nội dung sau:
```env
PORT = 3000
REACT_APP_BASE_URL = http://localhost:5460/users
```

```bash
cd frontend
npm start
```

> Mặc định chạy tại: `http://localhost:3000`

---

## 🛠 Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB & Mongoose
- React
- RESTful API

---
