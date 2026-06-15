import { useState } from 'react'
import { Copy, Download, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EXPORT_SIZES } from '@/lib/constants'
import { getContentPreview } from '@/lib/content-builder'
import { copyQRToClipboard, downloadQR } from '@/lib/qr-generator'
import { useQRStore } from '@/store/useQRStore'
import type { ExportFormat, ExportSize } from '@/types/qr'

export function ExportDialog() {
  const isOpen = useQRStore((s) => s.isExportDialogOpen)
  const setExportDialogOpen = useQRStore((s) => s.setExportDialogOpen)
  const config = useQRStore((s) => s.config)
  const updateExport = useQRStore((s) => s.updateExport)
  const addDownloadHistory = useQRStore((s) => s.addDownloadHistory)

  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadQR(
        config,
        config.export.size,
        config.export.format,
        'qr-studio',
      )
      addDownloadHistory({
        format: config.export.format,
        size: config.export.size,
        contentPreview: getContentPreview(config.content),
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleCopy = async () => {
    const success = await copyQRToClipboard(config, config.export.size)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setExportDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export QR Code</DialogTitle>
          <DialogDescription>
            Choose format and size for your QR code export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select
              value={config.export.format}
              onValueChange={(format) =>
                updateExport({ format: format as ExportFormat })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select
              value={String(config.export.size)}
              onValueChange={(size) =>
                updateExport({ size: parseInt(size, 10) as ExportSize })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_SIZES.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} × {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Exporting...' : 'Download'}
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
