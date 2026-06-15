import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { MAX_UNDO_HISTORY } from '@/lib/constants'
import { cloneConfig, defaultQRConfig, mergeConfig, normalizeLogoConfig } from '@/lib/default-config'
import {
  loadDownloadHistory,
  loadLastConfig,
  loadRecentColors,
  loadSavedPresets,
  saveDownloadHistory,
  saveLastConfig,
  saveRecentColors,
  saveSavedPresets,
} from '@/lib/storage'
import { generateId } from '@/lib/utils'
import type {
  AnalyticsPlaceholder,
  ColorConfig,
  ContentType,
  DownloadHistoryEntry,
  ExportConfig,
  LogoConfig,
  PartialQRConfig,
  QRConfig,
  QRContent,
  SavedPreset,
  StyleConfig,
  WiFiContent,
} from '@/types/qr'

interface QRStoreState {
  config: QRConfig
  savedPresets: SavedPreset[]
  recentColors: string[]
  downloadHistory: DownloadHistoryEntry[]
  analytics: AnalyticsPlaceholder
  past: QRConfig[]
  future: QRConfig[]
  isExportDialogOpen: boolean

  setConfig: (config: QRConfig, recordHistory?: boolean) => void
  updateContent: (content: Partial<QRContent>) => void
  setContentType: (type: ContentType) => void
  updateStyle: (style: Partial<StyleConfig>) => void
  updateColors: (colors: Partial<ColorConfig>) => void
  updateLogo: (logo: Partial<LogoConfig>) => void
  updateExport: (exportConfig: Partial<ExportConfig>) => void
  applyPartialConfig: (partial: PartialQRConfig) => void
  loadPreset: (preset: SavedPreset) => void
  saveCurrentAsPreset: (name: string) => void
  renamePreset: (id: string, name: string) => void
  deletePreset: (id: string) => void
  addRecentColor: (color: string) => void
  addDownloadHistory: (entry: Omit<DownloadHistoryEntry, 'id' | 'timestamp'>) => void
  clearDownloadHistory: () => void
  importConfig: (config: QRConfig) => void
  exportConfigJson: () => string
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  setExportDialogOpen: (open: boolean) => void
  resetConfig: () => void
}

function pushHistory(state: QRStoreState): { past: QRConfig[]; future: QRConfig[] } {
  const newPast = [...state.past, cloneConfig(state.config)].slice(-MAX_UNDO_HISTORY)
  return { past: newPast, future: [] }
}

const lastConfig = loadLastConfig()
const initialConfig = lastConfig
  ? mergeConfig(defaultQRConfig, {
      ...lastConfig,
      logo: lastConfig.logo
        ? normalizeLogoConfig(lastConfig.logo)
        : undefined,
    })
  : defaultQRConfig

export const useQRStore = create<QRStoreState>()(
  subscribeWithSelector((set, get) => ({
    config: initialConfig,
    savedPresets: loadSavedPresets(),
    recentColors: loadRecentColors(),
    downloadHistory: loadDownloadHistory(),
    analytics: {
      scans: 0,
      uniqueScans: 0,
      lastScan: null,
      enabled: false,
    },
    past: [],
    future: [],
    isExportDialogOpen: false,

    setConfig: (config, recordHistory = true) => {
      set((state) => ({
        config,
        ...(recordHistory ? pushHistory(state) : {}),
      }))
      saveLastConfig(config)
    },

    updateContent: (content) => {
      const { config } = get()
      get().setConfig({
        ...config,
        content: { ...config.content, ...content },
      })
    },

    setContentType: (type) => {
      get().updateContent({ type })
    },

    updateStyle: (style) => {
      const { config } = get()
      get().setConfig({
        ...config,
        style: { ...config.style, ...style },
      })
    },

    updateColors: (colors) => {
      const { config } = get()
      const newColors = {
        ...config.colors,
        ...colors,
        gradient: colors.gradient
          ? { ...config.colors.gradient, ...colors.gradient }
          : config.colors.gradient,
      }
      get().setConfig({ ...config, colors: newColors })
      if (colors.foreground) get().addRecentColor(colors.foreground)
      if (colors.background) get().addRecentColor(colors.background)
    },

    updateLogo: (logo) => {
      const { config } = get()
      get().setConfig({
        ...config,
        logo: { ...config.logo, ...logo },
      })
    },

    updateExport: (exportConfig) => {
      const { config } = get()
      get().setConfig({
        ...config,
        export: { ...config.export, ...exportConfig },
      })
    },

    applyPartialConfig: (partial) => {
      const { config } = get()
      get().setConfig(mergeConfig(config, partial))
    },

    loadPreset: (preset) => {
      get().setConfig(cloneConfig(preset.config))
    },

    saveCurrentAsPreset: (name) => {
      const { config, savedPresets } = get()
      const now = Date.now()
      const preset: SavedPreset = {
        id: generateId(),
        name,
        config: cloneConfig(config),
        createdAt: now,
        updatedAt: now,
      }
      const updated = [preset, ...savedPresets]
      set({ savedPresets: updated })
      saveSavedPresets(updated)
    },

    renamePreset: (id, name) => {
      const updated = get().savedPresets.map((p) =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
      )
      set({ savedPresets: updated })
      saveSavedPresets(updated)
    },

    deletePreset: (id) => {
      const updated = get().savedPresets.filter((p) => p.id !== id)
      set({ savedPresets: updated })
      saveSavedPresets(updated)
    },

    addRecentColor: (color) => {
      const normalized = color.toUpperCase()
      const updated = [
        normalized,
        ...get().recentColors.filter((c) => c !== normalized),
      ].slice(0, 12)
      set({ recentColors: updated })
      saveRecentColors(updated)
    },

    addDownloadHistory: (entry) => {
      const newEntry: DownloadHistoryEntry = {
        ...entry,
        id: generateId(),
        timestamp: Date.now(),
      }
      const updated = [newEntry, ...get().downloadHistory].slice(0, 20)
      set({ downloadHistory: updated })
      saveDownloadHistory(updated)
    },

    clearDownloadHistory: () => {
      set({ downloadHistory: [] })
      saveDownloadHistory([])
    },

    importConfig: (config) => {
      get().setConfig(cloneConfig(config))
    },

    exportConfigJson: () => {
      return JSON.stringify(get().config, null, 2)
    },

    undo: () => {
      const { past, config, future } = get()
      if (past.length === 0) return
      const previous = past[past.length - 1]
      set({
        config: previous,
        past: past.slice(0, -1),
        future: [cloneConfig(config), ...future],
      })
      saveLastConfig(previous)
    },

    redo: () => {
      const { past, config, future } = get()
      if (future.length === 0) return
      const next = future[0]
      set({
        config: next,
        past: [...past, cloneConfig(config)],
        future: future.slice(1),
      })
      saveLastConfig(next)
    },

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,

    setExportDialogOpen: (open) => set({ isExportDialogOpen: open }),

    resetConfig: () => {
      get().setConfig(cloneConfig(defaultQRConfig))
    },
  })),
)

// Re-export content helpers for convenience
export type { WiFiContent }
