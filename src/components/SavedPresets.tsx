import { useState } from 'react'
import { Pencil, Trash2, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQRStore } from '@/store/useQRStore'
import type { QRConfig, SavedPreset } from '@/types/qr'

export function SavedPresets() {
  const savedPresets = useQRStore((s) => s.savedPresets)
  const saveCurrentAsPreset = useQRStore((s) => s.saveCurrentAsPreset)
  const loadPreset = useQRStore((s) => s.loadPreset)
  const renamePreset = useQRStore((s) => s.renamePreset)
  const deletePreset = useQRStore((s) => s.deletePreset)
  const importConfig = useQRStore((s) => s.importConfig)
  const exportConfigJson = useQRStore((s) => s.exportConfigJson)

  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleSave = () => {
    if (!presetName.trim()) return
    saveCurrentAsPreset(presetName.trim())
    setPresetName('')
    setSaveDialogOpen(false)
  }

  const handleRename = (id: string) => {
    if (!editName.trim()) return
    renamePreset(id, editName.trim())
    setEditingId(null)
    setEditName('')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const config = JSON.parse(ev.target?.result as string) as QRConfig
          importConfig(config)
        } catch {
          // Invalid JSON
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleExport = () => {
    const json = exportConfigJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qr-studio-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSaveDialogOpen(true)}
        >
          Save Current Design
        </Button>
        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="h-4 w-4" />
          Import JSON
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export JSON
        </Button>
      </div>

      {savedPresets.length > 0 ? (
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {savedPresets.map((preset: SavedPreset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                {editingId === preset.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(preset.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="h-8 flex-1"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => loadPreset(preset)}
                    className="flex-1 text-left text-sm font-medium hover:text-primary"
                  >
                    {preset.name}
                  </button>
                )}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingId(preset.id)
                      setEditName(preset.name)
                    }}
                    aria-label={`Rename ${preset.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deletePreset(preset.id)}
                    aria-label={`Delete ${preset.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-sm text-muted-foreground">
          No saved presets yet. Save your current design to reuse it later.
        </p>
      )}

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Preset</DialogTitle>
            <DialogDescription>
              Give your current QR design a name to save it for later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                placeholder="My QR Design"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </div>
            <Button onClick={handleSave} disabled={!presetName.trim()}>
              Save Preset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
