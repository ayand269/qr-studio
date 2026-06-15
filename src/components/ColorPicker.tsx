import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  formatColor,
  hslToHex,
  isValidHex,
  normalizeHex,
  rgbToHex,
} from '@/lib/color-utils'
import { cn } from '@/lib/utils'
import { useQRStore } from '@/store/useQRStore'
import type { ColorFormat } from '@/types/qr'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  showRecent?: boolean
  showFormatTabs?: boolean
}

export function ColorPicker({
  label,
  value,
  onChange,
  showRecent = true,
  showFormatTabs = true,
}: ColorPickerProps) {
  const colorFormat = useQRStore((s) => s.config.colors.colorFormat)
  const updateColors = useQRStore((s) => s.updateColors)
  const recentColors = useQRStore((s) => s.recentColors)
  const [inputValue, setInputValue] = useState(value)

  const handleColorChange = (hex: string) => {
    const normalized = normalizeHex(hex)
    if (isValidHex(normalized)) {
      onChange(normalized)
      setInputValue(normalized)
    }
  }

  const handleFormatChange = (format: ColorFormat) => {
    updateColors({ colorFormat: format })
  }

  const handleTextInput = (text: string) => {
    setInputValue(text)
    if (text.startsWith('#') && isValidHex(text)) {
      handleColorChange(text)
      return
    }

    const rgbMatch = text.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (rgbMatch) {
      const hex = rgbToHex(
        parseInt(rgbMatch[1], 10),
        parseInt(rgbMatch[2], 10),
        parseInt(rgbMatch[3], 10),
      )
      handleColorChange(hex)
      return
    }

    const hslMatch = text.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    if (hslMatch) {
      const hex = hslToHex(
        parseInt(hslMatch[1], 10),
        parseInt(hslMatch[2], 10),
        parseInt(hslMatch[3], 10),
      )
      handleColorChange(hex)
    }
  }

  const displayValue = formatColor(value, colorFormat)

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {showFormatTabs && (
          <Tabs
            value={colorFormat}
            onValueChange={(v) => handleFormatChange(v as ColorFormat)}
          >
            <TabsList className="h-7">
              <TabsTrigger value="hex" className="px-2 text-xs">
                HEX
              </TabsTrigger>
              <TabsTrigger value="rgb" className="px-2 text-xs">
                RGB
              </TabsTrigger>
              <TabsTrigger value="hsl" className="px-2 text-xs">
                HSL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-input bg-background p-0.5 shadow-sm"
            aria-label={`${label} color picker`}
          />
        </div>
        <Input
          value={colorFormat === 'hex' ? inputValue : displayValue}
          onChange={(e) => handleTextInput(e.target.value)}
          className="bg-background font-mono text-sm"
          aria-label={`${label} color value`}
        />
      </div>

      {showRecent && recentColors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recentColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className={cn(
                'h-6 w-6 rounded-md border border-border transition-transform hover:scale-110',
                value === color && 'ring-2 ring-primary ring-offset-2',
              )}
              style={{ backgroundColor: color }}
              aria-label={`Use color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ColorPickerGroup() {
  const colors = useQRStore((s) => s.config.colors)
  const colorFormat = useQRStore((s) => s.config.colors.colorFormat)
  const updateColors = useQRStore((s) => s.updateColors)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Color format
        </Label>
        <Tabs
          value={colorFormat}
          onValueChange={(v) => updateColors({ colorFormat: v as ColorFormat })}
        >
          <TabsList className="h-7">
            <TabsTrigger value="hex" className="px-2 text-xs">
              HEX
            </TabsTrigger>
            <TabsTrigger value="rgb" className="px-2 text-xs">
              RGB
            </TabsTrigger>
            <TabsTrigger value="hsl" className="px-2 text-xs">
              HSL
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ColorPicker
        label="Foreground"
        value={colors.foreground}
        onChange={(foreground) => updateColors({ foreground })}
        showFormatTabs={false}
      />
      <ColorPicker
        label="Background"
        value={colors.background}
        onChange={(background) => updateColors({ background })}
        showFormatTabs={false}
      />
    </div>
  )
}
