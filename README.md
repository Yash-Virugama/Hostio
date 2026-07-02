<!-- Banner -->

<p align="center">
  <img src="assets/banner.png" alt="Hostio Banner" width="100%">
</p>

<h1 align="center">🏠 Hostio</h1>

<p align="center">
  <strong>A Full-Stack Property Rental Platform Inspired by Airbnb</strong>
</p>

<p align="center">
Built with Node.js, Express.js, MongoDB Atlas, EJS & Passport.js
</p>

<p align="center">
<img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white">
<img src="https://img.shields.io/badge/EJS-8BC34A">
<img src="https://img.shields.io/badge/Passport.js-34E27A?logo=passport&logoColor=white">
<img src="https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white">
<img src="https://img.shields.io/badge/License-MIT-blue.svg">
</p>

---

# 📖 About

**Hostio** is a full-stack property rental platform inspired by Airbnb that allows users to discover, list, and review rental properties.

The project was built to strengthen my understanding of **backend development**, **MVC architecture**, **authentication**, **RESTful APIs**, **cloud storage**, and **database design** while creating a production-ready web application.

---

# 🌐 Live Demo

**Application:** https://hostio.onrender.com

> **Note:** The application is hosted on Render's free tier and may take 30–60 seconds to wake up on the first request.

---

# ✨ Features

### 🏡 Property Listings

- Browse rental listings
- View property details
- Category-based filtering
- Create new listings
- Edit existing listings
- Delete listings

### 👤 User Authentication

- User Registration
- Login & Logout
- Secure Authentication using Passport.js
- Session Management

### ⭐ Reviews & Ratings

- Add ratings
- Write reviews
- Delete own reviews

### 📷 Image Uploads

- Cloudinary integration
- Secure cloud image storage

### 🗺 Location

- Interactive maps using MapTiler

### 🔒 Authorization

- Only owners can edit/delete listings
- Only review authors can delete reviews
- Protected routes

### 📱 Responsive Design

- Desktop
- Tablet
- Mobile

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- Bootstrap 5
- EJS
- EJS-Mate

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Authentication

- Passport.js
- Express Session
- Connect-Mongo

## Cloud Services

- Cloudinary
- MapTiler

## Deployment

- Render

---

# 🏗 Architecture

```
        Client (Browser)
               │
        HTTP Requests
               │
      Express.js Server
               │
     MVC Architecture
 ┌────────┼─────────┐
 │        │         │
Models Controllers Routes
 │
MongoDB Atlas
 │
Cloudinary (Images)
```

---

# 📂 Project Structure

```
Hostio/
│
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── middleware/
├── utils/
├── assets/
├── app.js
├── cloudConfig.js
├── schema.js
│── LICENSE   
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Yash-Virugama/Hostio.git

cd Hostio
```

---

## Install Dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env

ATLASDB_URL=your_MongoDB_Atlas_connection_string

SECRET=your_session_secret_key

CLOUD_NAME=your_cloudinary_cloud_name

CLOUD_API_KEY=your_cloudinary_api_key

CLOUD_API_SECRET=your_cloudinary_api_secret
```

---

# ▶️ Run Locally

```bash
npm start
```

Application runs at

```
http://localhost:8080
```

---

# 🧠 Challenges & Learnings

During this project I gained practical experience with:

- MVC Architecture
- RESTful APIs
- Passport.js Authentication
- Session Management
- Cloudinary Image Uploads
- MongoDB Data Modeling
- Server-side Validation
- Authorization & Access Control
- Express Middleware
- Deployment using Render

---

# 🚀 Future Improvements

- Wishlist functionality
- Booking system
- Payment integration
- User profile dashboard
- Advanced property search
- Property availability calendar
- Admin dashboard
- Notifications

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a Pull Request.

---

# 👨‍💻 Author

**Yash Virugama**

GitHub: https://github.com/Yash-Virugama

LinkedIn: *(Add your profile)*

---

# 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more details.

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!
