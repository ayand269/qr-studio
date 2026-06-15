import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ACCEPTED_LOGO_TYPES } from '@/lib/constants'
import { processLogoImage } from '@/lib/logo-processor'
import { cn } from '@/lib/utils'
import { useQRStore } from '@/store/useQRStore'

export function LogoUploader() {
  const logo = useQRStore((s) => s.config.logo)
  const updateLogo = useQRStore((s) => s.updateLogo)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const hasReprocessedOnMount = useRef(false)

  const applyProcessedLogo = useCallback(
    async (originalImage: string, borderRadius: number) => {
      setIsProcessing(true)
      try {
        const processed = await processLogoImage(originalImage, borderRadius)
        updateLogo({ originalImage, borderRadius, image: processed })
      } catch {
        updateLogo({ originalImage, borderRadius, image: null })
      } finally {
        setIsProcessing(false)
      }
    },
    [updateLogo],
  )

  const processFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_LOGO_TYPES.includes(file.type)) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          void applyProcessedLogo(result, logo.borderRadius)
        }
      }
      reader.readAsDataURL(file)
    },
    [applyProcessedLogo, logo.borderRadius],
  )

  useEffect(() => {
    if (hasReprocessedOnMount.current || !logo.originalImage) return
    hasReprocessedOnMount.current = true
    void applyProcessedLogo(logo.originalImage, logo.borderRadius)
  }, [logo.originalImage, logo.borderRadius, applyProcessedLogo])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const removeLogo = () => {
    updateLogo({ image: null, originalImage: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const previewSrc = logo.image ?? logo.originalImage

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_LOGO_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden
      />

      {previewSrc ? (
        <div className="space-y-4">
          <div
            className={cn(
              'relative flex items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors',
              isDragging && 'border-primary bg-primary/5',
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-muted">
              {isProcessing ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <img
                  src={previewSrc}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={removeLogo}
              aria-label="Remove logo"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Square crop · drag and drop to replace
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all hover:border-primary hover:bg-primary/5',
            isDragging && 'border-primary bg-primary/5',
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Drop logo here</p>
            <p className="text-xs text-muted-foreground">
              Any image — cropped to square automatically
            </p>
          </div>
          <Button variant="outline" size="sm" type="button">
            <Upload className="h-4 w-4" />
            Browse Files
          </Button>
        </button>
      )}

      {previewSrc && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Corner Radius</Label>
              <span className="text-sm text-muted-foreground">
                {logo.borderRadius}%
                {logo.borderRadius >= 100 ? ' · Circle' : ''}
              </span>
            </div>
            <Slider
              value={[logo.borderRadius]}
              onValueChange={([borderRadius]) => {
                if (logo.originalImage) {
                  void applyProcessedLogo(logo.originalImage, borderRadius)
                } else {
                  updateLogo({ borderRadius })
                }
              }}
              min={0}
              max={100}
              step={1}
              disabled={isProcessing || !logo.originalImage}
            />
            <p className="text-xs text-muted-foreground">
              0% is square, 100% is a perfect circle
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Logo Size</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(logo.size * 100)}%
              </span>
            </div>
            <Slider
              value={[logo.size * 100]}
              onValueChange={([v]) => updateLogo({ size: v / 100 })}
              min={15}
              max={65}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Percent of QR code area. Higher values need High error correction.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Logo Margin</Label>
              <span className="text-sm text-muted-foreground">
                {logo.margin}px
              </span>
            </div>
            <Slider
              value={[logo.margin]}
              onValueChange={([margin]) => updateLogo({ margin })}
              min={0}
              max={20}
              step={1}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hide-dots">Hide Background Dots</Label>
            <Switch
              id="hide-dots"
              checked={logo.hideBackgroundDots}
              onCheckedChange={(hideBackgroundDots) =>
                updateLogo({ hideBackgroundDots })
              }
            />
          </div>
        </>
      )}
    </div>
  )
}
