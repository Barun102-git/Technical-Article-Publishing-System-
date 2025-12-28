"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Check, X } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ReviewArticleCardProps {
  id: string
  title: string
  excerpt: string
  authorName: string
  status: "draft" | "pending" | "published" | "rejected"
  viewCount: number
  createdAt: Date
  onReview: (id: string, action: "approve" | "reject", reason?: string) => Promise<void>
}

export function ReviewArticleCard({
  id,
  title,
  excerpt,
  authorName,
  status,
  viewCount,
  createdAt,
  onReview,
}: ReviewArticleCardProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    await onReview(id, "approve")
    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }
    setIsProcessing(true)
    await onReview(id, "reject", rejectionReason)
    setShowRejectDialog(false)
    setRejectionReason("")
    setIsProcessing(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-balance">{title}</CardTitle>
            <Badge
              variant="secondary"
              className={
                status === "pending"
                  ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                  : status === "published"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
              }
            >
              {status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">by {authorName}</p>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-pretty text-sm text-muted-foreground">{excerpt}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t pt-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {viewCount}
              </div>
              <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/articles/${id}`}>
                <Eye className="mr-1 h-4 w-4" />
                Review
              </Link>
            </Button>
          </div>
          {status === "pending" && (
            <div className="flex w-full gap-2">
              <Button variant="default" size="sm" onClick={handleApprove} disabled={isProcessing} className="flex-1">
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowRejectDialog(true)}
                disabled={isProcessing}
                className="flex-1"
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Article</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this article.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this article is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing ? "Rejecting..." : "Reject Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
