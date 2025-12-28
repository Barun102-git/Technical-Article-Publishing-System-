"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  status: "draft" | "pending" | "published" | "rejected"
  viewCount: number
  createdAt: Date
  rejectionReason?: string
  onDelete?: (id: string) => void
}

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  published: "bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function ArticleCard({
  id,
  title,
  excerpt,
  status,
  viewCount,
  createdAt,
  rejectionReason,
  onDelete,
}: ArticleCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-balance">{title}</CardTitle>
          <Badge variant="secondary" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-pretty text-sm text-muted-foreground">{excerpt}</p>
        {rejectionReason && (
          <div className="mt-3 rounded-md bg-red-500/10 p-2">
            <p className="text-xs text-red-600 dark:text-red-400">
              <strong>Rejection reason:</strong> {rejectionReason}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 border-t pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {viewCount}
          </div>
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/articles/${id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
