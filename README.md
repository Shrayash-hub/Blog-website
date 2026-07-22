<div align="center">

# 📝 Blogfolio

**A full-stack blogging & social publishing platform** — built with a custom Node.js/Express/MongoDB backend (migrated off a third-party BaaS), a React frontend, and deployed on AWS.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20S3-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Live Demo](http://blogfolio-frontend-shrayash.s3-website.ap-south-1.amazonaws.com) · [Report Bug](https://github.com/Shrayash-hub/Blog-website/issues) · [Request Feature](https://github.com/Shrayash-hub/Blog-website/issues)

</div>

---

## 📖 Overview

Blogfolio is a full-stack blogging platform where users can register, write and publish rich-text articles, upload featured images, tag and search content, bookmark posts, and manage a public author profile.

The project was originally prototyped on a third-party Backend-as-a-Service (Appwrite) and later **migrated to a fully custom REST API** built with Node.js, Express, and MongoDB — including hand-rolled JWT authentication, file uploads, and pagination — as an exercise in owning the entire stack end-to-end. The app is deployed on AWS (EC2 for the API, S3 for the static frontend) with MongoDB Atlas as the managed database.

## ✨ Features

- 🔐 **JWT authentication** — register/login/logout with access + refresh token rotation, bcrypt password hashing
- ✍️ **Rich-text post editor** — TinyMCE-powered editor with featured image upload, tags, excerpts, and draft/published status
- 🔍 **Search & discovery** — full-text-style title search, tag filtering, paginated post feeds
- 🔖 **Bookmarks** — save posts to read later, toggle on/off, dedicated saved-posts view
- 👤 **Author profiles** — public profile pages with bio, avatar, and social links (GitHub, LinkedIn, website)
- 📊 **Dashboard** — at-a-glance stats (total/published/draft/saved posts) and quick actions
- 📱 **Responsive, animated UI** — Tailwind CSS v4 with smooth entrance/hover animations
- ☁️ **Cloud-deployed** — live on AWS (EC2 + S3), backed by MongoDB Atlas

## 🏗️ Architecture

```
┌─────────────────┐        REST API (JWT Bearer auth)        ┌──────────────────┐
│  React Frontend │ ────────────────────────────────────────▶│  Express Backend │
│  (AWS S3, Vite) │◀──────────────────────────────────────── │    (AWS EC2)     │
└─────────────────┘                                          └────────┬─────────┘
                                                                       │
                                                                       ▼
                                                              ┌──────────────────┐
                                                              │  MongoDB Atlas   │
                                                              └──────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Redux Toolkit, React Router v7, React Hook Form, Tailwind CSS v4, TinyMCE |
| **Backend** | Node.js, Express, Mongoose (MongoDB ODM), JWT, bcrypt, Multer |
| **Database** | MongoDB Atlas |
| **Deployment** | AWS EC2 (backend, via PM2), AWS S3 (static frontend hosting) |
| **Tooling** | Git, ESLint, Postman (API testing) |

## 📡 API Reference

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Create a new account | Public |
| `POST` | `/auth/login` | Log in | Public |
| `POST` | `/auth/logout` | Log out | Required |
| `POST` | `/auth/refresh-token` | Refresh access token | Public (refresh token) |
| `GET` | `/auth/current-user` | Get logged-in user | Required |
| `GET` | `/posts` | List published posts (paginated) | Public |
| `GET` | `/posts/search?q=` | Search posts by title | Public |
| `GET` | `/posts/:slug` | Get a single post | Public |
| `POST` | `/posts` | Create a post (with image upload) | Required |
| `PATCH` | `/posts/:slug` | Update a post | Required (owner) |
| `DELETE` | `/posts/:slug` | Delete a post | Required (owner) |
| `GET` | `/posts/mine/all` | Get the logged-in user's posts | Required |
| `GET` | `/profiles/:userID` | Get a public profile | Public |
| `PUT` | `/profiles` | Create/update own profile | Required |
| `POST` | `/bookmarks/:postID/toggle` | Bookmark / un-bookmark a post | Required |
| `GET` | `/bookmarks/:postID/status` | Check bookmark status | Required |
| `GET` | `/bookmarks/mine` | Get saved posts | Required |
| `POST` | `/upload` | Standalone image upload (editor) | Required |
| `GET` | `/healthcheck` | Server health check | Public |

## 📂 Project Structure

```
Blog-website/
├── server/                    # Express + MongoDB backend
│   ├── src/
│   │   ├── models/            # Mongoose schemas (User, Post, Profile, Bookmark)
│   │   ├── controllers/       # Route handlers
│   │   ├── routes/            # Express routers
│   │   ├── middlewares/       # Auth (JWT), file upload (Multer), error handling
│   │   ├── utils/             # ApiError, ApiResponse, token generation, helpers
│   │   ├── db/                # MongoDB connection
│   │   ├── app.js             # Express app setup
│   │   └── index.js           # Entry point
│   └── package.json
├── src/                        # React frontend
│   ├── api/                   # API client layer (auth, posts, profiles, bookmarks)
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route-level pages
│   ├── store/                  # Redux slices
│   └── conf/                   # Environment config
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/Shrayash-hub/Blog-website.git
cd Blog-website
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env   # fill in your MongoDB URI and JWT secrets
npm run dev
```

### 3. Frontend setup
```bash
cd ..
npm install
# create a .env file with: VITE_API_BASE_URL=http://localhost:8000/api/v1
npm run dev
```

The app will be running at `http://localhost:5173` (frontend) and `http://localhost:8000` (backend).

## ☁️ Deployment

This project is deployed entirely within the **AWS Free Tier**:
- **Backend** — Node/Express app running on an EC2 `t3.micro` instance, managed with PM2 for process persistence and auto-restart
- **Frontend** — Vite production build hosted as a static website on S3
- **Database** — MongoDB Atlas (M0 free cluster)
- **Auth transport** — JWT delivered via `Authorization: Bearer` header (chosen over cookies to support the cross-origin S3 ↔ EC2 setup without requiring HTTPS/CloudFront)

## 🗺️ Roadmap

- [ ] Migrate image storage from EC2 local disk to S3
- [ ] Add HTTPS via CloudFront + custom domain
- [ ] Set up CI/CD (GitHub Actions) for automatic deployment on push
- [ ] Add comment threads on posts



## 👤 Author

**Shrayash Awasthi**
- GitHub: [@Shrayash-hub](https://github.com/Shrayash-hub)
- LinkedIn: [shrayash-awasthi]([https://linkedin.com/in/shrayash-awasthi](https://www.linkedin.com/in/shrayash-awasthi-1524b3326/)

---

<div align="center">
If you found this project interesting, consider giving it a ⭐!
</div>
