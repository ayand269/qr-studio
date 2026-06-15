function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load logo image'))
    img.src = src
  })
}

export { loadImage }

const OUTPUT_SIZE = 512

function clipShape(
  ctx: CanvasRenderingContext2D,
  size: number,
  borderRadiusPercent: number,
) {
  const radius = (borderRadiusPercent / 100) * (size / 2)
  ctx.beginPath()
  if (radius >= size / 2 - 0.5) {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  } else if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(0, 0, size, size, radius)
  } else {
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
  }
  ctx.clip()
}

export async function processLogoImage(
  source: string,
  borderRadiusPercent: number,
): Promise<string> {
  const img = await loadImage(source)
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  clipShape(ctx, OUTPUT_SIZE, borderRadiusPercent)

  const scale = Math.max(OUTPUT_SIZE / img.width, OUTPUT_SIZE / img.height)
  const width = img.width * scale
  const height = img.height * scale
  ctx.drawImage(
    img,
    (OUTPUT_SIZE - width) / 2,
    (OUTPUT_SIZE - height) / 2,
    width,
    height,
  )

  return canvas.toDataURL('image/png')
}
