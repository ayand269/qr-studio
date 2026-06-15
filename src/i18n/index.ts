export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja'

export interface TranslationKeys {
  appName: string
  export: string
  content: string
  customize: string
  download: string
  save: string
  undo: string
  redo: string
  copy: string
  batch: string
  home: string
}

const translations: Record<Locale, TranslationKeys> = {
  en: {
    appName: 'QR Studio',
    export: 'Export',
    content: 'Content',
    customize: 'Customize',
    download: 'Download',
    save: 'Save',
    undo: 'Undo',
    redo: 'Redo',
    copy: 'Copy',
    batch: 'Batch',
    home: 'Home',
  },
  es: {
    appName: 'QR Studio',
    export: 'Exportar',
    content: 'Contenido',
    customize: 'Personalizar',
    download: 'Descargar',
    save: 'Guardar',
    undo: 'Deshacer',
    redo: 'Rehacer',
    copy: 'Copiar',
    batch: 'Lote',
    home: 'Inicio',
  },
  fr: {
    appName: 'QR Studio',
    export: 'Exporter',
    content: 'Contenu',
    customize: 'Personnaliser',
    download: 'Télécharger',
    save: 'Enregistrer',
    undo: 'Annuler',
    redo: 'Rétablir',
    copy: 'Copier',
    batch: 'Lot',
    home: 'Accueil',
  },
  de: {
    appName: 'QR Studio',
    export: 'Exportieren',
    content: 'Inhalt',
    customize: 'Anpassen',
    download: 'Herunterladen',
    save: 'Speichern',
    undo: 'Rückgängig',
    redo: 'Wiederholen',
    copy: 'Kopieren',
    batch: 'Stapel',
    home: 'Start',
  },
  ja: {
    appName: 'QR Studio',
    export: 'エクスポート',
    content: 'コンテンツ',
    customize: 'カスタマイズ',
    download: 'ダウンロード',
    save: '保存',
    undo: '元に戻す',
    redo: 'やり直す',
    copy: 'コピー',
    batch: '一括',
    home: 'ホーム',
  },
}

let currentLocale: Locale = 'en'

export function setLocale(locale: Locale): void {
  currentLocale = locale
}

export function getLocale(): Locale {
  return currentLocale
}

export function t(key: keyof TranslationKeys): string {
  return translations[currentLocale][key]
}

export function useTranslation() {
  return { t, locale: currentLocale, setLocale }
}
