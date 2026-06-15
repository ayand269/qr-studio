import {
  Camera,
  Globe,
  MessageCircle,
  Share2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQRStore } from '@/store/useQRStore'
import type { BrandPreset } from '@/types/qr'

const ICON_MAP = {
  instagram: Camera,
  facebook: Share2,
  'message-circle': MessageCircle,
  linkedin: Globe,
  sparkles: Sparkles,
} as const

interface PresetCardProps {
  preset: BrandPreset
}

export function PresetCard({ preset }: PresetCardProps) {
  const applyPartialConfig = useQRStore((s) => s.applyPartialConfig)
  const Icon = ICON_MAP[preset.icon as keyof typeof ICON_MAP] ?? Sparkles

  return (
    <button
      type="button"
      onClick={() => applyPartialConfig(preset.config)}
      className={cn(
        'group flex w-full min-w-0 flex-col items-center gap-2 rounded-xl border p-3 transition-all',
        'hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-[0.98]',
      )}
      aria-label={`Apply ${preset.name} preset`}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${preset.color}20`, color: preset.color }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium">{preset.name}</span>
    </button>
  )
}

interface StylePreviewCardProps {
  label: string
  selected: boolean
  onClick: () => void
  preview: React.ReactNode
}

export function StylePreviewCard({
  label,
  selected,
  onClick,
  preview,
}: StylePreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full min-w-0 flex-col items-center gap-1.5 rounded-xl border p-2 sm:gap-2 sm:p-3',
        'transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]',
        selected
          ? 'border-primary bg-primary/5 outline outline-2 outline-primary -outline-offset-2'
          : 'border-border',
      )}
      aria-label={`Select ${label} style`}
      aria-pressed={selected}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted sm:h-12 sm:w-12">
        {preview}
      </div>
      <span className="w-full truncate text-center text-[10px] font-medium leading-tight sm:text-xs">
        {label}
      </span>
    </button>
  )
}

function DotPreview({ style }: { style: string }) {
  const dotClass = {
    square: 'rounded-none',
    dots: 'rounded-full',
    rounded: 'rounded-sm',
    classy: 'rounded-none skew-x-6',
    'classy-rounded': 'rounded-md',
    'extra-rounded': 'rounded-full',
  }[style] ?? 'rounded-none'

  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className={cn('h-2.5 w-2.5 bg-foreground', dotClass)}
        />
      ))}
    </div>
  )
}

export function DotStylePreviewCard({
  style,
  label,
  selected,
  onClick,
}: {
  style: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <StylePreviewCard
      label={label}
      selected={selected}
      onClick={onClick}
      preview={<DotPreview style={style} />}
    />
  )
}

export function CornerStylePreviewCard({
  style,
  label,
  selected,
  onClick,
}: {
  style: string
  label: string
  selected: boolean
  onClick: () => void
}) {
  const cornerClass = {
    square: 'rounded-none',
    dot: 'rounded-full',
    'extra-rounded': 'rounded-xl',
  }[style] ?? 'rounded-none'

  return (
    <StylePreviewCard
      label={label}
      selected={selected}
      onClick={onClick}
      preview={
        <div className="relative h-10 w-10">
          <div
            className={cn(
              'absolute left-0 top-0 h-4 w-4 border-4 border-foreground',
              cornerClass,
            )}
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-foreground/30" />
        </div>
      }
    />
  )
}
