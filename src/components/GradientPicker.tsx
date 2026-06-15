import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ColorPicker } from '@/components/ColorPicker'
import { useQRStore } from '@/store/useQRStore'
import type { GradientType } from '@/types/qr'

export function GradientPicker() {
  const gradient = useQRStore((s) => s.config.colors.gradient)
  const updateColors = useQRStore((s) => s.updateColors)

  const updateGradient = (partial: Partial<typeof gradient>) => {
    updateColors({
      gradient: { ...gradient, ...partial },
    })
  }

  return (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="gradient-toggle">Use Gradient</Label>
        <Switch
          id="gradient-toggle"
          checked={gradient.enabled}
          onCheckedChange={(enabled) => updateGradient({ enabled })}
        />
      </div>

      {gradient.enabled && (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <Label>Gradient Type</Label>
            <Select
              value={gradient.type}
              onValueChange={(type) =>
                updateGradient({ type: type as GradientType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ColorPicker
            label="Start Color"
            value={gradient.startColor}
            onChange={(startColor) => updateGradient({ startColor })}
            showRecent={false}
            showFormatTabs={false}
          />

          <ColorPicker
            label="End Color"
            value={gradient.endColor}
            onChange={(endColor) => updateGradient({ endColor })}
            showRecent={false}
            showFormatTabs={false}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Rotation</Label>
              <span className="text-sm text-muted-foreground">
                {gradient.rotation}°
              </span>
            </div>
            <Slider
              value={[gradient.rotation]}
              onValueChange={([rotation]) => updateGradient({ rotation })}
              min={0}
              max={360}
              step={1}
            />
          </div>

          <div
            className="h-8 rounded-lg border"
            style={{
              background:
                gradient.type === 'linear'
                  ? `linear-gradient(${gradient.rotation}deg, ${gradient.startColor}, ${gradient.endColor})`
                  : `radial-gradient(circle, ${gradient.startColor}, ${gradient.endColor})`,
            }}
            aria-hidden
          />
        </div>
      )}
    </div>
  )
}
