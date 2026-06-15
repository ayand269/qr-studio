import { STORAGE_KEYS } from '@/lib/constants'
import type {
  DownloadHistoryEntry,
  QRConfig,
  SavedPreset,
} from '@/types/qr'

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function loadTheme(): 'light' | 'dark' | 'system' {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

export function saveTheme(theme: 'light' | 'dark' | 'system'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
}

export function loadSavedPresets(): SavedPreset[] {
  return loadFromStorage<SavedPreset[]>(STORAGE_KEYS.PRESETS, [])
}

export function saveSavedPresets(presets: SavedPreset[]): void {
  saveToStorage(STORAGE_KEYS.PRESETS, presets)
}

export function loadRecentColors(): string[] {
  return loadFromStorage<string[]>(STORAGE_KEYS.RECENT_COLORS, [])
}

export function saveRecentColors(colors: string[]): void {
  saveToStorage(STORAGE_KEYS.RECENT_COLORS, colors.slice(0, 12))
}

export function loadDownloadHistory(): DownloadHistoryEntry[] {
  return loadFromStorage<DownloadHistoryEntry[]>(
    STORAGE_KEYS.DOWNLOAD_HISTORY,
    [],
  )
}

export function saveDownloadHistory(history: DownloadHistoryEntry[]): void {
  saveToStorage(STORAGE_KEYS.DOWNLOAD_HISTORY, history.slice(0, 20))
}

export function loadLastConfig(): Partial<QRConfig> | null {
  return loadFromStorage<Partial<QRConfig> | null>(
    STORAGE_KEYS.LAST_CONFIG,
    null,
  )
}

export function saveLastConfig(config: QRConfig): void {
  saveToStorage(STORAGE_KEYS.LAST_CONFIG, config)
}
