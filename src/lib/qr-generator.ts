import QRCodeStyling from 'qr-code-styling'
import type { Options } from 'qr-code-styling'
import { buildQRData } from '@/lib/content-builder'
import { renderQRCode } from '@/lib/qr-render'
import type { ExportFormat, QRConfig } from '@/types/qr'

function buildColorOptions(config: QRConfig): Pick<
  Options,
  'dotsOptions' | 'cornersSquareOptions' | 'cornersDotOptions' | 'backgroundOptions'
> {
  const { colors, style } = config
  const gradient = colors.gradient.enabled
    ? {
        type: colors.gradient.type,
        rotation: colors.gradient.rotation,
        colorStops: [
          { offset: 0, color: colors.gradient.startColor },
          { offset: 1, color: colors.gradient.endColor },
        ],
      }
    : undefined

  const foregroundColor = colors.foreground
  const backgroundColor =
    colors.backgroundType === 'transparent'
      ? 'transparent'
      : colors.background

  return {
    dotsOptions: {
      type: style.dotStyle,
      color: gradient ? undefined : foregroundColor,
      gradient,
    },
    cornersSquareOptions: {
      type: style.cornerStyle,
      color: gradient ? undefined : foregroundColor,
      gradient,
    },
    cornersDotOptions: {
      type: style.cornerStyle === 'dot' ? 'dot' : style.cornerStyle,
      color: gradient ? undefined : foregroundColor,
      gradient,
    },
    backgroundOptions: {
      color: backgroundColor,
    },
  }
}

export function createQROptions(
  config: QRConfig,
  size: number,
): Options {
  const data = buildQRData(config.content)

  const options: Options = {
    width: size,
    height: size,
    type: 'canvas',
    data,
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: config.style.errorCorrection,
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: config.logo.margin,
      imageSize: 0.4,
      hideBackgroundDots: config.logo.hideBackgroundDots,
    },
    ...buildColorOptions(config),
  }

  if (config.logo.image) {
    options.image = config.logo.image
  }

  return options
}

export function createQRInstance(
  config: QRConfig,
  size: number,
): QRCodeStyling {
  return new QRCodeStyling(createQROptions(config, size))
}

export async function downloadQR(
  config: QRConfig,
  size: number,
  format: ExportFormat,
  filename = 'qr-code',
): Promise<void> {
  if (format === 'svg') {
    const qr = createQRInstance(config, size)
    await qr.download({
      name: filename,
      extension: 'svg',
    })
    return
  }

  const canvas = await renderQRCode(config, size)
  const extension = format === 'jpg' ? 'jpeg' : format
  const mimeType = `image/${extension}`

  await new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to export QR code'))
          return
        }
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.${format}`
        link.click()
        URL.revokeObjectURL(url)
        resolve()
      },
      mimeType,
      format === 'jpg' ? 0.92 : undefined,
    )
  })
}

export async function getQRBlob(
  config: QRConfig,
  size: number,
  format: ExportFormat,
): Promise<Blob | null> {
  if (format === 'svg') {
    const qr = createQRInstance(config, size)
    const rawData = await qr.getRawData('svg')
    if (!rawData) return null
    if (rawData instanceof Blob) return rawData
    if (rawData instanceof ArrayBuffer) {
      return new Blob([rawData], { type: 'image/svg+xml' })
    }
    return new Blob([new Uint8Array(rawData)], { type: 'image/svg+xml' })
  }

  const canvas = await renderQRCode(config, size)
  const extension = format === 'jpg' ? 'jpeg' : format
  const mimeType = `image/${extension}`

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      mimeType,
      format === 'jpg' ? 0.92 : undefined,
    )
  })
}

export async function copyQRToClipboard(
  config: QRConfig,
  size: number,
): Promise<boolean> {
  try {
    const blob = await getQRBlob(config, size, 'png')
    if (!blob) return false
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
    return true
  } catch {
    return false
  }
}

export async function getQRDataUrl(
  config: QRConfig,
  size: number,
): Promise<string | null> {
  const blob = await getQRBlob(config, size, 'png')
  if (!blob) return null
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}
