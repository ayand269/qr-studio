import { useEffect, useRef } from 'react'
import { PREVIEW_RENDER_SIZE } from '@/lib/constants'
import { renderQRCode } from '@/lib/qr-render'
import { useQRStore } from '@/store/useQRStore'

export function useQRCode(containerRef: React.RefObject<HTMLDivElement | null>) {
  const config = useQRStore((s) => s.config)
  const renderIdRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderId = ++renderIdRef.current

    void renderQRCode(config, PREVIEW_RENDER_SIZE).then((canvas) => {
      if (renderId !== renderIdRef.current) return
      container.replaceChildren(canvas)
    })

    return () => {
      renderIdRef.current++
      container.replaceChildren()
    }
  }, [config, containerRef])

  return {}
}
