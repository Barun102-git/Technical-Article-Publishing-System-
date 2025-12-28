# Technical Article CMS - Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/article-cms

# JWT Secret (change this to a strong random string in production)
JWT_SECRET=your-secret-key-here-change-this-in-production
```

### MongoDB Setup

For local development, ensure MongoDB is running:

```bash
# If using MongoDB Community Edition
mongod
```

Or use MongoDB Atlas:
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Replace the `MONGODB_URI` with your Atlas connection string

## Installation

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## User Roles

### Admin
- Email: `admin@example.com`
- Password: `admin123`
- Can review and publish articles

### Writer
- Email: `writer@example.com`
- Password: `writer123`
- Can create and submit articles for review

### Reader
- Email: `reader@example.com`
- Password: `reader123`
- Can read published articles

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Articles
- `GET /api/articles` - Get all published articles
- `POST /api/articles` - Create new article (writer)
- `GET /api/articles/[id]` - Get article by ID
- `PUT /api/articles/[id]` - Update article (writer)
- `DELETE /api/articles/[id]` - Delete article (writer)
- `POST /api/articles/[id]/submit` - Submit for review (writer)
- `POST /api/articles/[id]/review` - Review article (admin)
