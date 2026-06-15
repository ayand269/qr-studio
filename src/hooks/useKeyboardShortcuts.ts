import { useEffect } from 'react'
import { useQRStore } from '@/store/useQRStore'

export function useKeyboardShortcuts() {
  const undo = useQRStore((s) => s.undo)
  const redo = useQRStore((s) => s.redo)
  const setExportDialogOpen = useQRStore((s) => s.setExportDialogOpen)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey

      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      if (isMeta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }

      if (isMeta && e.key === 'e') {
        e.preventDefault()
        setExportDialogOpen(true)
      }

      if (isMeta && e.key === 's') {
        e.preventDefault()
        setExportDialogOpen(true)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, setExportDialogOpen])
}
