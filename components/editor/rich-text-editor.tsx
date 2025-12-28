"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Quote, Code, LinkIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || "text"
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newValue)

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
    }, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-muted/30 p-2">
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("*", "*")}>
            <Italic className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-4 w-px bg-border" />
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("# ", "")}>
            H1
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("## ", "")}>
            H2
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("### ", "")}>
            H3
          </Button>
          <div className="mx-2 h-4 w-px bg-border" />
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("- ", "")}>
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("1. ", "")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("> ", "")}>
            <Quote className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("`", "`")}>
            <Code className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("[", "](url)")}>
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant={showPreview ? "default" : "ghost"}
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {showPreview ? (
        <div className="prose prose-sm max-w-none rounded-b-lg border bg-background p-4 dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[400px] rounded-t-none font-mono text-sm"
        />
      )}
    </div>
  )
}

// Simple markdown renderer (basic implementation)
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>")
}
