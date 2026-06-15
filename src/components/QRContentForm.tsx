import {
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Type,
  Wifi,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useQRStore } from '@/store/useQRStore'
import type { ContentType } from '@/types/qr'

const CONTENT_TYPES: {
  value: ContentType
  label: string
  icon: React.ReactNode
}[] = [
  { value: 'url', label: 'URL', icon: <Globe className="h-4 w-4" /> },
  { value: 'text', label: 'Text', icon: <Type className="h-4 w-4" /> },
  { value: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
  { value: 'phone', label: 'Phone', icon: <Phone className="h-4 w-4" /> },
  { value: 'sms', label: 'SMS', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="h-4 w-4" /> },
]

export function QRContentForm() {
  const content = useQRStore((s) => s.config.content)
  const setContentType = useQRStore((s) => s.setContentType)
  const updateContent = useQRStore((s) => s.updateContent)

  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Content Type
        </Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {CONTENT_TYPES.map((type) => {
            const selected = content.type === type.value
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setContentType(type.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-all',
                  'hover:border-primary hover:bg-primary/5 active:scale-[0.98]',
                  selected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-background text-muted-foreground',
                )}
                aria-pressed={selected}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-lg border bg-muted/20 p-4">
        {content.type === 'url' && (
          <div className="space-y-2">
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={content.url}
              onChange={(e) => updateContent({ url: e.target.value })}
              className="bg-background"
            />
          </div>
        )}

        {content.type === 'text' && (
          <div className="space-y-2">
            <Label htmlFor="text-input">Text Content</Label>
            <Input
              id="text-input"
              placeholder="Hello World"
              value={content.text}
              onChange={(e) => updateContent({ text: e.target.value })}
              className="bg-background"
            />
          </div>
        )}

        {content.type === 'email' && (
          <div className="space-y-2">
            <Label htmlFor="email-input">Email Address</Label>
            <Input
              id="email-input"
              type="email"
              placeholder="test@example.com"
              value={content.email}
              onChange={(e) => updateContent({ email: e.target.value })}
              className="bg-background"
            />
          </div>
        )}

        {content.type === 'phone' && (
          <div className="space-y-2">
            <Label htmlFor="phone-input">Phone Number</Label>
            <Input
              id="phone-input"
              type="tel"
              placeholder="+919999999999"
              value={content.phone}
              onChange={(e) => updateContent({ phone: e.target.value })}
              className="bg-background"
            />
          </div>
        )}

        {content.type === 'sms' && (
          <div className="space-y-2">
            <Label htmlFor="sms-input">SMS Number</Label>
            <Input
              id="sms-input"
              type="tel"
              placeholder="+919999999999"
              value={content.sms}
              onChange={(e) => updateContent({ sms: e.target.value })}
              className="bg-background"
            />
          </div>
        )}

        {content.type === 'wifi' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ssid-input">Network Name (SSID)</Label>
              <Input
                id="ssid-input"
                placeholder="MyWifi"
                value={content.wifi.ssid}
                onChange={(e) =>
                  updateContent({
                    wifi: { ...content.wifi, ssid: e.target.value },
                  })
                }
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-input">Password</Label>
              <Input
                id="password-input"
                type="password"
                placeholder="password"
                value={content.wifi.password}
                onChange={(e) =>
                  updateContent({
                    wifi: { ...content.wifi, password: e.target.value },
                  })
                }
                disabled={content.wifi.securityType === 'nopass'}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Security Type</Label>
              <Select
                value={content.wifi.securityType}
                onValueChange={(securityType) =>
                  updateContent({
                    wifi: {
                      ...content.wifi,
                      securityType: securityType as 'WPA' | 'WEP' | 'nopass',
                    },
                  })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
