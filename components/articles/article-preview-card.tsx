import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ArticlePreviewCardProps {
  id: string
  title: string
  excerpt: string
  authorName: string
  tags: string[]
  viewCount: number
  publishedAt: Date
}

export function ArticlePreviewCard({
  id,
  title,
  excerpt,
  authorName,
  tags,
  viewCount,
  publishedAt,
}: ArticlePreviewCardProps) {
  return (
    <Link href={`/articles/${id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/20">
        <CardHeader>
          <CardTitle className="line-clamp-2 text-balance text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-pretty text-sm text-muted-foreground">{excerpt}</p>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <span>By {authorName}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewCount}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
