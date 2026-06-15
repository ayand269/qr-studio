import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQRStore } from '@/store/useQRStore'

export function DownloadHistory() {
  const downloadHistory = useQRStore((s) => s.downloadHistory)
  const clearDownloadHistory = useQRStore((s) => s.clearDownloadHistory)

  if (downloadHistory.length === 0) return null

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 pb-3">
        <CardTitle className="text-sm font-semibold">Download History</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={clearDownloadHistory}
          aria-label="Clear download history"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          {downloadHistory.slice(0, 5).map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 text-xs"
            >
              <span className="min-w-0 truncate font-medium text-foreground">
                {entry.contentPreview}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {entry.format.toUpperCase()} · {entry.size}px
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
