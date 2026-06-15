import type { LogoConfig, PartialQRConfig, QRConfig } from '@/types/qr'

export const defaultQRConfig: QRConfig = {
  content: {
    type: 'url',
    url: 'https://example.com',
    text: 'Hello World',
    email: 'test@example.com',
    phone: '+919999999999',
    sms: '+919999999999',
    wifi: {
      ssid: 'MyWifi',
      password: 'password',
      securityType: 'WPA',
    },
  },
  style: {
    dotStyle: 'square',
    cornerStyle: 'square',
    size: 800,
    errorCorrection: 'M',
  },
  colors: {
    foreground: '#000000',
    background: '#FFFFFF',
    backgroundType: 'solid',
    colorFormat: 'hex',
    gradient: {
      enabled: false,
      type: 'linear',
      startColor: '#000000',
      endColor: '#6366F1',
      rotation: 0,
    },
  },
  logo: {
    image: null,
    originalImage: null,
    size: 0.4,
    margin: 5,
    hideBackgroundDots: true,
    borderRadius: 0,
  },
  export: {
    format: 'png',
    size: 800,
  },
}

export function normalizeLogoConfig(logo: Partial<LogoConfig>): LogoConfig {
  const merged = { ...defaultQRConfig.logo, ...logo }
  return {
    ...merged,
    originalImage: merged.originalImage ?? merged.image,
  }
}

export function mergeConfig(
  base: QRConfig,
  partial: PartialQRConfig,
): QRConfig {
  return {
    content: {
      ...base.content,
      ...partial.content,
      wifi: {
        ...base.content.wifi,
        ...partial.content?.wifi,
      },
    },
    style: { ...base.style, ...partial.style },
    colors: {
      ...base.colors,
      ...partial.colors,
      gradient: {
        ...base.colors.gradient,
        ...partial.colors?.gradient,
      },
    },
    logo: normalizeLogoConfig({ ...base.logo, ...partial.logo }),
    export: { ...base.export, ...partial.export },
  }
}

export function cloneConfig(config: QRConfig): QRConfig {
  return JSON.parse(JSON.stringify(config)) as QRConfig
}
