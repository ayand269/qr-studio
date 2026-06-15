import type {
  BrandPreset,
  DotStyle,
  ErrorCorrectionLevel,
  ExportSize,
  PreviewSize,
  QRTemplate,
} from '@/types/qr'

export const PREVIEW_SIZES: PreviewSize[] = [256, 512, 800, 1024, 2048]

export const PREVIEW_RENDER_SIZE = 256

export const EXPORT_SIZES: ExportSize[] = [512, 800, 1024, 2048]

export const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
]

export const CORNER_STYLES = [
  { value: 'square' as const, label: 'Square' },
  { value: 'dot' as const, label: 'Dot' },
  { value: 'extra-rounded' as const, label: 'Extra Rounded' },
]

export const ERROR_CORRECTION_LEVELS: {
  value: ErrorCorrectionLevel
  label: string
  description: string
}[] = [
  {
    value: 'L',
    label: 'Low (7%)',
    description: 'Best for clean environments. Smallest QR code size.',
  },
  {
    value: 'M',
    label: 'Medium (15%)',
    description: 'Good balance between size and recovery capability.',
  },
  {
    value: 'Q',
    label: 'Quartile (25%)',
    description: 'Higher recovery for partially damaged codes.',
  },
  {
    value: 'H',
    label: 'High (30%)',
    description: 'Maximum recovery. Best when using logos or overlays.',
  },
]

export const BRAND_PRESETS: BrandPreset[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    color: '#E4405F',
    config: {
      style: { dotStyle: 'extra-rounded', cornerStyle: 'extra-rounded' },
      colors: { foreground: '#000000' },
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    config: {
      style: { dotStyle: 'rounded' },
      colors: { foreground: '#1877F2' },
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'message-circle',
    color: '#25D366',
    config: {
      style: { dotStyle: 'rounded' },
      colors: { foreground: '#25D366' },
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0077B5',
    config: {
      style: { dotStyle: 'square' },
      colors: { foreground: '#0077B5' },
    },
  },
  {
    id: 'premium-black',
    name: 'Premium Black',
    icon: 'sparkles',
    color: '#000000',
    config: {
      style: { dotStyle: 'classy-rounded' },
      colors: { foreground: '#000000' },
    },
  },
]

export const QR_TEMPLATES: QRTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean black and white design',
    category: 'Business',
    premium: false,
    config: {
      style: { dotStyle: 'square', cornerStyle: 'square' },
      colors: { foreground: '#000000', background: '#FFFFFF' },
    },
  },
  {
    id: 'modern-dots',
    name: 'Modern Dots',
    description: 'Rounded dots with soft corners',
    category: 'Creative',
    premium: false,
    config: {
      style: { dotStyle: 'dots', cornerStyle: 'dot' },
      colors: { foreground: '#1a1a2e', background: '#FFFFFF' },
    },
  },
  {
    id: 'gradient-pro',
    name: 'Gradient Pro',
    description: 'Premium gradient styling',
    category: 'Premium',
    premium: true,
    config: {
      style: { dotStyle: 'extra-rounded', cornerStyle: 'extra-rounded' },
      colors: {
        foreground: '#6366f1',
        gradient: {
          enabled: true,
          type: 'linear',
          startColor: '#6366f1',
          endColor: '#8b5cf6',
          rotation: 45,
        },
      },
    },
  },
]

export const STORAGE_KEYS = {
  THEME: 'qr-studio-theme',
  PRESETS: 'qr-studio-presets',
  RECENT_COLORS: 'qr-studio-recent-colors',
  DOWNLOAD_HISTORY: 'qr-studio-download-history',
  LAST_CONFIG: 'qr-studio-last-config',
} as const

export const ACCEPTED_LOGO_TYPES = [
  'image/png',
  'image/svg+xml',
  'image/jpeg',
  'image/webp',
]

export const MAX_UNDO_HISTORY = 50
