/// <reference types="vite/client" />

declare module 'qr-code-styling' {
  export interface Gradient {
    type: 'linear' | 'radial'
    rotation?: number
    colorStops: { offset: number; color: string }[]
  }

  export interface DotType {
    type?: string
    color?: string
    gradient?: Gradient
  }

  export interface Options {
    width?: number
    height?: number
    type?: 'canvas' | 'svg'
    data?: string
    image?: string
    margin?: number
    qrOptions?: {
      typeNumber?: number
      mode?: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji'
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    }
    imageOptions?: {
      hideBackgroundDots?: boolean
      imageSize?: number
      margin?: number
      crossOrigin?: string
    }
    dotsOptions?: DotType
    cornersSquareOptions?: DotType
    cornersDotOptions?: DotType
    backgroundOptions?: {
      color?: string
      gradient?: Gradient
    }
  }

  export default class QRCodeStyling {
    constructor(options: Options)
    append(container: HTMLElement): void
    update(options: Options): void
    download(downloadOptions?: {
      name?: string
      extension?: 'png' | 'svg' | 'jpeg' | 'webp'
    }): Promise<void>
    getRawData(extension?: 'png' | 'svg' | 'jpeg' | 'webp'): Promise<Blob | ArrayBuffer | null>
  }
}
