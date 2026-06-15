import {
  Info,
  Layers,
  Link2,
  Palette,
  Settings2,
  Shapes,
  Sparkles,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ColorPickerGroup } from '@/components/ColorPicker'
import { GradientPicker } from '@/components/GradientPicker'
import { LogoUploader } from '@/components/LogoUploader'
import {
  CornerStylePreviewCard,
  DotStylePreviewCard,
  PresetCard,
} from '@/components/PresetCard'
import { QRContentForm } from '@/components/QRContentForm'
import {
  BRAND_PRESETS,
  CORNER_STYLES,
  DOT_STYLES,
  ERROR_CORRECTION_LEVELS,
} from '@/lib/constants'
import { useQRStore } from '@/store/useQRStore'
import type { BackgroundType, ErrorCorrectionLevel } from '@/types/qr'

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {children}
    </span>
  )
}

function AccordionSectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <SectionIcon>{icon}</SectionIcon>
      <div className="min-w-0 text-left">
        <span className="block text-sm font-semibold">{title}</span>
        {description && (
          <span className="block text-xs font-normal text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </div>
  )
}

export function QRCustomizer() {
  const style = useQRStore((s) => s.config.style)
  const colors = useQRStore((s) => s.config.colors)
  const updateStyle = useQRStore((s) => s.updateStyle)
  const updateColors = useQRStore((s) => s.updateColors)

  return (
    <TooltipProvider>
      <Card className="shadow-sm">
        <CardHeader className="border-b pb-5">
          <CardTitle className="text-lg">Customization</CardTitle>
          <CardDescription>
            Expand each section to fine-tune your QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Accordion
            type="multiple"
            defaultValue={['content']}
            className="flex w-full min-w-0 flex-col gap-2"
          >
            <AccordionItem value="content">
              <AccordionTrigger>
                <AccordionSectionHeader
                  icon={<Link2 className="h-4 w-4" />}
                  title="Content"
                  description="URL, text, email, phone, SMS, or WiFi"
                />
              </AccordionTrigger>
              <AccordionContent>
                <QRContentForm />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="styles">
              <AccordionTrigger>
                <AccordionSectionHeader
                  icon={<Shapes className="h-4 w-4" />}
                  title="Shape & Style"
                  description="Dot and corner appearance"
                />
              </AccordionTrigger>
              <AccordionContent className="overflow-visible">
                <div className="w-full min-w-0 max-w-full space-y-6">
                  <div>
                    <Label className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Dot Style
                    </Label>
                    <div className="grid w-full max-w-full grid-cols-3 gap-2 sm:grid-cols-3">
                      {DOT_STYLES.map((dot) => (
                        <DotStylePreviewCard
                          key={dot.value}
                          style={dot.value}
                          label={dot.label}
                          selected={style.dotStyle === dot.value}
                          onClick={() => updateStyle({ dotStyle: dot.value })}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Corner Style
                    </Label>
                    <div className="grid w-full max-w-full grid-cols-3 gap-2">
                      {CORNER_STYLES.map((corner) => (
                        <CornerStylePreviewCard
                          key={corner.value}
                          style={corner.value}
                          label={corner.label}
                          selected={style.cornerStyle === corner.value}
                          onClick={() =>
                            updateStyle({ cornerStyle: corner.value })
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="colors">
              <AccordionTrigger>
                <AccordionSectionHeader
                  icon={<Palette className="h-4 w-4" />}
                  title="Colors & Background"
                  description="Foreground, background, and gradients"
                />
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <ColorPickerGroup />
                  <GradientPicker />
                  <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                    <Label>Background Type</Label>
                    <Select
                      value={colors.backgroundType}
                      onValueChange={(type) =>
                        updateColors({ backgroundType: type as BackgroundType })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid Color</SelectItem>
                        <SelectItem value="transparent">Transparent</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Use transparent for overlaying on images or colored surfaces.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="logo">
              <AccordionTrigger>
                <AccordionSectionHeader
                  icon={<Layers className="h-4 w-4" />}
                  title="Logo"
                  description="Add a brand logo to the center"
                />
              </AccordionTrigger>
              <AccordionContent>
                <LogoUploader />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advanced">
              <AccordionTrigger>
                <AccordionSectionHeader
                  icon={<Settings2 className="h-4 w-4" />}
                  title="Advanced"
                  description="Error correction for logos and damage recovery"
                />
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Label>Error Correction Level</Label>
                  <Select
                    value={style.errorCorrection}
                    onValueChange={(level) =>
                      updateStyle({
                        errorCorrection: level as ErrorCorrectionLevel,
                      })
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ERROR_CORRECTION_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            {level.label}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                {level.description}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Use Medium or higher when adding a logo to your QR code.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="presets">
              <AccordionTrigger>
                <AccordionSectionHeader
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Brand Presets"
                  description="One-click styles for popular platforms"
                />
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                  {BRAND_PRESETS.map((preset) => (
                    <PresetCard key={preset.id} preset={preset} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
