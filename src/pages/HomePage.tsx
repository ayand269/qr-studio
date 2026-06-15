import { QRCustomizer } from '@/components/QRCustomizer'
import { QRPreview } from '@/components/QRPreview'
import { DownloadHistory } from '@/components/DownloadHistory'
import { ExportDialog } from '@/components/ExportDialog'
import { PageContainer } from '@/components/layout/PageContainer'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function PageHeader() {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Create your QR code
      </h1>
      <p className="text-sm text-muted-foreground sm:text-base">
        Enter your content, customize the look, and download instantly.
      </p>
    </div>
  )
}

export function HomePage() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <PageContainer className="space-y-6">
        <PageHeader />
        <QRPreview />
        <Tabs defaultValue="customize" className="w-full">
          <TabsList className="grid h-11 w-full grid-cols-2">
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="customize" className="mt-4">
            <QRCustomizer />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <DownloadHistory />
          </TabsContent>
        </Tabs>
        <ExportDialog />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-8">
      <PageHeader />
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <QRCustomizer />
        </div>
        <div className="space-y-4 lg:sticky lg:top-24">
          <QRPreview />
          <DownloadHistory />
        </div>
      </div>
      <ExportDialog />
    </PageContainer>
  )
}
