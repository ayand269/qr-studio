import { useRef, useState } from 'react'
import { Copy, Download, Image } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PREVIEW_RENDER_SIZE } from '@/lib/constants'
import { getContentPreview } from '@/lib/content-builder'
import { copyQRToClipboard, downloadQR } from '@/lib/qr-generator'
import { cn } from '@/lib/utils'
import { useQRCode } from '@/hooks/useQRCode'
import { useQRStore } from '@/store/useQRStore'
import type { ExportFormat } from '@/types/qr'

export function QRPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const config = useQRStore((s) => s.config)
  const addDownloadHistory = useQRStore((s) => s.addDownloadHistory)
  const setExportDialogOpen = useQRStore((s) => s.setExportDialogOpen)

  useQRCode(containerRef)

  const [copied, setCopied] = useState(false)

  const contentPreview = getContentPreview(config.content)
  const isTransparent = config.colors.backgroundType === 'transparent'

  const handleQuickDownload = async (format: ExportFormat) => {
    await downloadQR(config, config.export.size, format, 'qr-studio')
    addDownloadHistory({
      format,
      size: config.export.size,
      contentPreview,
    })
  }

  const handleCopy = async () => {
    const success = await copyQRToClipboard(config, config.export.size)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Live Preview</CardTitle>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {PREVIEW_RENDER_SIZE}px
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden rounded-xl border p-6 sm:p-8',
            isTransparent ? 'checkerboard' : 'bg-muted/40',
          )}
        >
          <div
            ref={containerRef}
            className="shrink-0 overflow-hidden rounded-lg shadow-md [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
            style={{
              width: PREVIEW_RENDER_SIZE,
              height: PREVIEW_RENDER_SIZE,
            }}
            role="img"
            aria-label="QR code preview"
          />
        </div>

        <div className="rounded-lg bg-muted/40 px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Encoded content
          </p>
          <p className="mt-0.5 truncate text-sm font-medium">{contentPreview}</p>
        </div>

        <div className="flex gap-2">
          <Button
            className="h-11 flex-1 gap-2"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            Export QR Code
          </Button>
          <Button
            variant="outline"
            className="h-11 shrink-0 gap-2"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Quick download
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['png', 'svg', 'jpg'] as ExportFormat[]).map((format) => (
              <Button
                key={format}
                variant="secondary"
                size="sm"
                className="h-9 gap-1.5"
                onClick={() => handleQuickDownload(format)}
              >
                <Image className="h-3.5 w-3.5" />
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
