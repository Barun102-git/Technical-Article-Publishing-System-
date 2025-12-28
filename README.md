# Technical-Article-Publishing-System-
 A full-stack MERN (MongoDB, Express, React, Node.js) application for publishing technical articles with role-based access control.

Features
Three User Roles:

Admin: Review, publish, edit, and delete any articles
Writer: Create and edit their own articles (draft/private/published)
Reader: Browse and read published articles
Article Management:

Create articles with draft/published/private status
Edit articles (writers can edit their own, admins can edit any)
Publish articles (admin only via publish button)
Delete articles (writers can delete their own, admins can delete any)
Tag articles for better organization
Search & Filter System:

Real-time search by title, content, tags, or author name
Date-based filtering (Today, Last Week, Last Month, Last Year)
Combined search and date filtering
Enhanced Admin Controls:

Admin can edit any article from article list or detail view
Admin can delete any article with confirmation
Admin dashboard for managing all articles
Separate admin routes for complete article management

Tech Stack:-
Backend:
Node.js & Express.js
MongoDB with Mongoose
JWT Authentication
bcryptjs for password hashing

Frontend:
React 18
React Router for navigation
Axios for API calls
Vite for build tooling

Project Structure:-




Technical Article publishing system/




├── backend/

│   ├── models/

│   │   ├── User.js

│   │   └── Article.js

│   ├── routes/

│   │   ├── auth.js


│   │   └── articles.js

│   ├── middleware/

│   │   └── auth.js

│   ├── server.js

│   ├── package.json

│   └── .env.example












├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   └── Navbar.jsx

│   │   ├── pages/

│   │   │   ├── Home.jsx

│   │   │   ├── Login.jsx

│   │   │   ├── Register.jsx

│   │   │   ├── ArticleList.jsx

│   │   │   ├── ArticleDetail.jsx

│   │   │   ├── CreateArticle.jsx

│   │   │   ├── EditArticle.jsx

│   │   │   ├── MyArticles.jsx

│   │   │   └── AdminDashboard.jsx

│   │   ├── context/

│   │   │   └── AuthContext.jsx

│   │   ├── App.jsx

│   │   ├── main.jsx

│   │   └── index.css

│   ├── index.html

│   ├── vite.config.js

│   └── package.json

└── README.md



Setup
Navigate to the frontend directory (Terminal2): 
Install dependencies:
npm install
Start the development server:
npm run dev
http://192.168.29.158:3000/



API Routes
Authentication Routes
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user (protected)
Article Routes
POST /api/articles - Create article (Writer/Admin only)
GET /api/articles - Get all published articles (Public)
GET /api/articles/:id - Get article by ID (Public if published)
PUT /api/articles/:id - Update article (Writer own article/Admin)
DELETE /api/articles/:id - Delete article (Admin only)
PATCH /api/articles/:id/publish - Publish article (Admin only)
GET /api/articles/my/articles - Get user's articles (Writer/Admin only)



Data Models


User Model
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (enum: 'admin', 'writer', 'reader'),
  timestamps
}



Article Model
{
  title: String,
  content: String,
  tags: [String],
  author: ObjectId (ref: User),
  status: String (enum: 'draft', 'published', 'private'),
  publishedAt: Date,
  timestamps
}





New Features Added


Enhanced Admin Capabilities

Admins can now edit any article regardless of author or status

Delete functionality available for admins on all articles

Edit and Delete buttons available in article lists for admins

Complete article management from both list view and detail view

Search and Filter System:-

Real-time Search: Search across title, content, tags, and author names

Date Filtering: Filter articles by Today, Last Week, Last Month, Last Year

Combined Filtering: Use search and date filters together

Responsive Design: Works on all device sizes

Article Status System:-

Draft: Visible to author and admins only

Published: Visible to everyone

Private: Visible to author and admins only

Writers can set any status when creating/editing articles

Admins can change any article status

Role-Based Authorization Matrix

Action	Reader	Writer	Admin

View published articles	✅	✅	✅

Create articles	❌	✅	✅

Edit own drafts/private	❌	✅	✅

Edit any article	❌	❌	✅

Publish articles	❌	❌	✅

Delete own articles	❌	✅	✅

Delete any article	❌	❌	✅


Usage
Register/Login: Create an account with your desired role (admin, writer, or reader)






Writers:

Create new articles (draft/published/private status)
Edit your own articles
Delete your own articles
View all your articles in "My Articles" section
Admins:

View all articles (drafts, published, and private)
Edit any article (from article list or detail view)
Delete any article with confirmation
Publish draft articles
Complete article management via Admin Dashboard
Readers:

Browse published articles
Search articles by title, content, tags, or author
Filter articles by date (Today, Last Week, Last Month, Last Year)
Read article details
Search & Filter (All Users):

Use search bar to find articles by keywords
Filter by date ranges for recent content
Real-time filtering as you type
Security Features
Password hashing with bcryptjs
JWT-based authentication with 7-day expiration
Role-based authorization middleware
Protected API routes
Enhanced permission system:
Writers can edit/delete their own articles
Admins can edit/delete any article
Automatic admin user creation on server startup
Input validation and sanitization
Secure article visibility based on user roles
License
ISC


