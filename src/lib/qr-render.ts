import QRCodeStyling from 'qr-code-styling'
import { loadImage } from '@/lib/logo-processor'
import { createQROptions } from '@/lib/qr-generator'
import type { QRConfig } from '@/types/qr'

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, r)
  } else {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + width - r, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + r)
    ctx.lineTo(x + width, y + height - r)
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
    ctx.lineTo(x + r, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }
}

function getLogoBackgroundColor(config: QRConfig): string {
  if (config.colors.backgroundType === 'transparent') {
    return '#ffffff'
  }
  return config.colors.background
}

async function waitForCanvas(qr: QRCodeStyling): Promise<HTMLCanvasElement> {
  const raw = await qr.getRawData('png')
  if (!(raw instanceof Blob)) {
    throw new Error('Failed to render QR code')
  }

  const url = URL.createObjectURL(raw)
  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')
    ctx.drawImage(img, 0, 0)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function renderQRCode(
  config: QRConfig,
  size: number,
): Promise<HTMLCanvasElement> {
  const options = createQROptions(config, size)
  const logo = config.logo

  const qrOptions = { ...options, image: undefined }
  const qr = new QRCodeStyling(qrOptions)
  const canvas = await waitForCanvas(qr)

  if (!logo.image) {
    return canvas
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const img = await loadImage(logo.image)
  const qrMargin = options.margin ?? 10
  const innerSize = canvas.width - qrMargin * 2
  const clearSize = innerSize * logo.size
  const logoPx = Math.max(0, clearSize - logo.margin * 2)
  const clearX = (canvas.width - clearSize) / 2
  const clearY = (canvas.height - clearSize) / 2
  const drawX = clearX + logo.margin
  const drawY = clearY + logo.margin

  if (logo.hideBackgroundDots && logoPx > 0) {
    ctx.save()
    roundRectPath(ctx, clearX, clearY, clearSize, clearSize, clearSize * 0.08)
    ctx.fillStyle = getLogoBackgroundColor(config)
    ctx.fill()
    ctx.restore()
  }

  if (logoPx > 0) {
    ctx.drawImage(img, drawX, drawY, logoPx, logoPx)
  }

  return canvas
}
