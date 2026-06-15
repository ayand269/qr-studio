import type { QRContent } from '@/types/qr'

export function buildQRData(content: QRContent): string {
  switch (content.type) {
    case 'url':
      return content.url.trim() || 'https://example.com'
    case 'text':
      return content.text.trim() || 'Hello World'
    case 'email':
      return content.email.trim()
        ? `mailto:${content.email.trim()}`
        : 'mailto:test@example.com'
    case 'phone':
      return content.phone.trim()
        ? `tel:${content.phone.trim()}`
        : 'tel:+919999999999'
    case 'sms':
      return content.sms.trim()
        ? `sms:${content.sms.trim()}`
        : 'sms:+919999999999'
    case 'wifi': {
      const { ssid, password, securityType } = content.wifi
      const type = securityType === 'nopass' ? 'nopass' : securityType
      const pass = securityType === 'nopass' ? '' : password
      return `WIFI:T:${type};S:${ssid || 'MyWifi'};P:${pass};;`
    }
    default:
      return 'https://example.com'
  }
}

export function getContentPreview(content: QRContent): string {
  const data = buildQRData(content)
  return data.length > 40 ? `${data.slice(0, 40)}...` : data
}
