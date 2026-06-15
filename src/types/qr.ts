export type ContentType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi'

export type DotStyle =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'classy'
  | 'classy-rounded'
  | 'extra-rounded'

export type CornerStyle = 'square' | 'dot' | 'extra-rounded'

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export type GradientType = 'linear' | 'radial'

export type BackgroundType = 'solid' | 'transparent'

export type ExportFormat = 'png' | 'svg' | 'jpg'

export type ExportSize = 512 | 800 | 1024 | 2048

export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export type PreviewSize = 256 | 512 | 800 | 1024 | 2048

export interface WiFiContent {
  ssid: string
  password: string
  securityType: 'WPA' | 'WEP' | 'nopass'
}

export interface QRContent {
  type: ContentType
  url: string
  text: string
  email: string
  phone: string
  sms: string
  wifi: WiFiContent
}

export interface GradientConfig {
  enabled: boolean
  type: GradientType
  startColor: string
  endColor: string
  rotation: number
}

export interface ColorConfig {
  foreground: string
  background: string
  backgroundType: BackgroundType
  gradient: GradientConfig
  colorFormat: ColorFormat
}

export interface LogoConfig {
  image: string | null
  originalImage: string | null
  size: number
  margin: number
  hideBackgroundDots: boolean
  borderRadius: number
}

export interface StyleConfig {
  dotStyle: DotStyle
  cornerStyle: CornerStyle
  size: PreviewSize
  errorCorrection: ErrorCorrectionLevel
}

export interface ExportConfig {
  format: ExportFormat
  size: ExportSize
}

export interface QRConfig {
  content: QRContent
  style: StyleConfig
  colors: ColorConfig
  logo: LogoConfig
  export: ExportConfig
}

export interface SavedPreset {
  id: string
  name: string
  config: QRConfig
  createdAt: number
  updatedAt: number
}

export interface DownloadHistoryEntry {
  id: string
  format: ExportFormat
  size: ExportSize
  timestamp: number
  contentPreview: string
}

export interface BrandPreset {
  id: string
  name: string
  icon: string
  color: string
  config: PartialQRConfig
}

export interface BatchItem {
  name: string
  url: string
}

export interface QRTemplate {
  id: string
  name: string
  description: string
  category: string
  config: PartialQRConfig
  premium: boolean
}

export interface AnalyticsPlaceholder {
  scans: number
  uniqueScans: number
  lastScan: string | null
  enabled: boolean
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface PartialQRConfig {
  content?: DeepPartial<QRContent>
  style?: DeepPartial<StyleConfig>
  colors?: DeepPartial<ColorConfig>
  logo?: DeepPartial<LogoConfig>
  export?: DeepPartial<ExportConfig>
}
