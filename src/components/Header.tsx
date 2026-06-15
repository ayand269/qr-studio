import { Link } from 'react-router-dom'
import {
  Download,
  Layers,
  Moon,
  QrCode,
  Redo2,
  Sun,
  Undo2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { t } from '@/i18n/index'
import { useThemeStore } from '@/store/useThemeStore'
import { useQRStore } from '@/store/useQRStore'

export function Header() {
  const setExportDialogOpen = useQRStore((s) => s.setExportDialogOpen)
  const undo = useQRStore((s) => s.undo)
  const redo = useQRStore((s) => s.redo)
  const canUndo = useQRStore((s) => s.canUndo)
  const canRedo = useQRStore((s) => s.canRedo)

  const theme = useThemeStore((s) => s.theme)
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const setTheme = useThemeStore((s) => s.setTheme)

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <QrCode className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t('appName')}</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo()}
                  aria-label={t('undo')}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('undo')} (⌘Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo()}
                  aria-label={t('redo')}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('redo')} (⌘⇧Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/batch" aria-label={t('batch')}>
                    <Layers className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Batch Generator</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {theme === 'system' ? 'System theme' : `${resolvedTheme} mode`}
              </TooltipContent>
            </Tooltip>

            <Button
              onClick={() => setExportDialogOpen(true)}
              className="hidden sm:inline-flex"
            >
              <Download className="h-4 w-4" />
              {t('export')}
            </Button>

            <Button
              size="icon"
              onClick={() => setExportDialogOpen(true)}
              className="sm:hidden"
              aria-label={t('export')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
