import { useCallback, useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Download, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getQRBlob } from '@/lib/qr-generator'
import { useQRStore } from '@/store/useQRStore'
import type { BatchItem } from '@/types/qr'

function parseCSV(text: string): BatchItem[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const items: BatchItem[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const commaIndex = line.indexOf(',')
    if (commaIndex === -1) continue

    const name = line.slice(0, commaIndex).trim()
    let url = line.slice(commaIndex + 1).trim()

    if (url.startsWith('"') && url.endsWith('"')) {
      url = url.slice(1, -1)
    }

    if (name && url) {
      items.push({ name, url })
    }
  }

  return items
}

export function BatchGenerator() {
  const config = useQRStore((s) => s.config)
  const [items, setItems] = useState<BatchItem[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = ev.target?.result as string
        setItems(parseCSV(text))
      }
      reader.readAsText(file)
    },
    [],
  )

  const handleTextInput = useCallback((text: string) => {
    setItems(parseCSV(text))
  }, [])

  const downloadAll = async () => {
    if (items.length === 0) return

    setGenerating(true)
    setProgress(0)

    try {
      const zip = new JSZip()

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemConfig = {
          ...config,
          content: {
            ...config.content,
            type: 'url' as const,
            url: item.url,
          },
        }

        const blob = await getQRBlob(itemConfig, config.export.size, 'png')
        if (blob) {
          const safeName = item.name.replace(/[^a-zA-Z0-9-_]/g, '_')
          zip.file(`${safeName}.png`, blob)
        }

        setProgress(Math.round(((i + 1) / items.length) * 100))
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'qr-codes-batch.zip')
    } finally {
      setGenerating(false)
      setProgress(0)
    }
  }

  const sampleCSV = `name,url
Google,https://google.com
Facebook,https://facebook.com`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Batch QR Generator</h1>
        <p className="text-muted-foreground">
          Upload a CSV file to generate multiple QR codes at once.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            CSV Upload
          </CardTitle>
          <CardDescription>
            Format: name,url — one entry per line after the header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-text">Or paste CSV content</Label>
            <textarea
              id="csv-text"
              className="flex min-h-32 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={sampleCSV}
              onChange={(e) => handleTextInput(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTextInput(sampleCSV)}
          >
            <Upload className="h-4 w-4" />
            Load Sample Data
          </Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {items.length} QR Code{items.length !== 1 ? 's' : ''} Ready
            </CardTitle>
            <CardDescription>
              Using current style settings. Export size: {config.export.size}px
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-64 overflow-y-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-muted-foreground truncate max-w-xs">
                        {item.url}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              onClick={downloadAll}
              disabled={generating}
              className="w-full sm:w-auto"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating... {progress}%
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download All as ZIP
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
