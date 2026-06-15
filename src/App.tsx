import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Header } from '@/components/Header'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useUrlParams } from '@/hooks/useUrlParams'
import { HomePage } from '@/pages/HomePage'
import { BatchPage } from '@/pages/BatchPage'
import { useThemeStore } from '@/store/useThemeStore'

function GitHubPagesRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirectPath = params.get('p')
    if (!redirectPath) return

    params.delete('p')
    const remaining = params.toString()
    navigate(`/${redirectPath}${remaining ? `?${remaining}` : ''}`, { replace: true })
  }, [navigate])

  return null
}

function AppContent() {
  const initializeTheme = useThemeStore((s) => s.initialize)

  useUrlParams()
  useKeyboardShortcuts()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <div className="app-bg min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="py-6 sm:py-8">
        <GitHubPagesRedirect />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/batch" element={<BatchPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </BrowserRouter>
  )
}
