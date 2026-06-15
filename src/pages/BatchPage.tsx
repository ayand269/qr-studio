import { BatchGenerator } from '@/components/BatchGenerator'
import { ExportDialog } from '@/components/ExportDialog'
import { PageContainer } from '@/components/layout/PageContainer'

export function BatchPage() {
  return (
    <PageContainer>
      <BatchGenerator />
      <ExportDialog />
    </PageContainer>
  )
}
