import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { DotStyle, ErrorCorrectionLevel, PartialQRConfig } from '@/types/qr'
import { useQRStore } from '@/store/useQRStore'

const VALID_STYLES: DotStyle[] = [
  'square',
  'dots',
  'rounded',
  'classy',
  'classy-rounded',
  'extra-rounded',
]

const VALID_EC: ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H']

export function useUrlParams() {
  const [searchParams] = useSearchParams()
  const applyPartialConfig = useQRStore((s) => s.applyPartialConfig)
  const updateContent = useQRStore((s) => s.updateContent)

  useEffect(() => {
    const url = searchParams.get('url')
    const text = searchParams.get('text')
    const style = searchParams.get('style') as DotStyle | null
    const fg = searchParams.get('fg') ?? searchParams.get('foreground')
    const bg = searchParams.get('bg') ?? searchParams.get('background')
    const size = searchParams.get('size')
    const ec = searchParams.get('ec') ?? searchParams.get('errorCorrection')
    const corner = searchParams.get('corner')

    if (!url && !text && !style && !fg && !bg && !size && !ec && !corner) return

    if (url) {
      updateContent({ type: 'url', url })
    } else if (text) {
      updateContent({ type: 'text', text })
    }

    const partial: PartialQRConfig = {}

    if (style && VALID_STYLES.includes(style)) {
      partial.style = { dotStyle: style }
    }

    if (corner && ['square', 'dot', 'extra-rounded'].includes(corner)) {
      partial.style = {
        ...partial.style,
        cornerStyle: corner as 'square' | 'dot' | 'extra-rounded',
      }
    }

    if (fg || bg) {
      partial.colors = {}
      if (fg) partial.colors.foreground = fg.startsWith('#') ? fg : `#${fg}`
      if (bg) partial.colors.background = bg.startsWith('#') ? bg : `#${bg}`
    }

    if (size) {
      const sizeNum = parseInt(size, 10)
      if ([256, 512, 800, 1024, 2048].includes(sizeNum)) {
        partial.style = {
          ...partial.style,
          size: sizeNum as 256 | 512 | 800 | 1024 | 2048,
        }
      }
    }

    if (ec && VALID_EC.includes(ec as ErrorCorrectionLevel)) {
      partial.style = {
        ...partial.style,
        errorCorrection: ec as ErrorCorrectionLevel,
      }
    }

    if (Object.keys(partial).length > 0) {
      applyPartialConfig(partial)
    }
  }, [searchParams, applyPartialConfig, updateContent])
}
