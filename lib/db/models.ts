import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  username: string
  email: string
  password: string // bcrypt hashed
  role: "admin" | "writer" | "reader"
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  _id?: ObjectId
  title: string
  content: string
  excerpt: string
  authorId: ObjectId
  authorName: string
  status: "draft" | "pending" | "published" | "rejected"
  tags: string[]
  coverImage?: string
  viewCount: number
  rejectionReason?: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id?: ObjectId
  articleId: ObjectId
  userId: ObjectId
  userName: string
  content: string
  createdAt: Date
}
