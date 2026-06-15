# QR Studio

**Create beautiful, customized QR codes in your browser — no account, no server, no limits.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_QR_Studio-6366f1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ayand269.github.io/qr-studio/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **[Open QR Studio →](https://ayand269.github.io/qr-studio/)**

QR Studio is a fast, privacy-friendly QR code generator. Design branded codes with custom colors, gradients, logos, and styles — then export as PNG, SVG, or JPG. Everything runs locally in your browser.

---

## Highlights

| Feature | Description |
| --- | --- |
| **Live preview** | See every change instantly as you customize |
| **6 content types** | URL, Text, Email, Phone, SMS, and WiFi |
| **Full styling** | Dot styles, corner shapes, colors, gradients, and center logos |
| **Brand presets** | Instagram, Facebook, WhatsApp, LinkedIn, Premium Black, and more |
| **Export options** | PNG, SVG, or JPG at 512–2048px |
| **Batch mode** | Upload a CSV, generate many codes, download as ZIP |
| **Saved presets** | Save, rename, and reload your favorite designs |
| **Dark mode** | Light and dark themes with persistence |
| **Power tools** | Undo/redo, clipboard copy, download history, JSON import/export |

---

## Quick start

### Use it online

No install needed — open the live app:

**https://ayand269.github.io/qr-studio/**

### Run locally

**Requirements:** Node.js 20.19+ or 22.12+

```bash
git clone https://github.com/ayand269/qr-studio.git
cd qr-studio
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview
```

---

## How to use

1. **Enter content** — paste a URL, type text, or choose Email, Phone, SMS, or WiFi.
2. **Customize** — pick colors, gradients, dot styles, corner shapes, and optionally add a logo.
3. **Export** — download as PNG, SVG, or JPG, or copy to clipboard.

### Batch generator

Go to **[Batch mode](https://ayand269.github.io/qr-studio/batch)** and upload a CSV:

```csv
name,url
Google,https://google.com
Facebook,https://facebook.com
```

Download all generated QR codes as a single ZIP file.

### URL parameters

Pre-fill settings by adding query parameters:

```
https://ayand269.github.io/qr-studio/?url=https://google.com
https://ayand269.github.io/qr-studio/?url=https://google.com&style=rounded&fg=1877F2
https://ayand269.github.io/qr-studio/?text=Hello%20World&size=1024&ec=H
```

| Parameter | Description |
| --- | --- |
| `url` | Website URL |
| `text` | Plain text |
| `style` | Dot style: `square`, `dots`, `rounded`, `classy`, `classy-rounded`, `extra-rounded` |
| `corner` | Corner style: `square`, `dot`, `extra-rounded` |
| `fg` / `foreground` | Foreground color (hex) |
| `bg` / `background` | Background color (hex) |
| `size` | Size: `256`, `512`, `800`, `1024`, `2048` |
| `ec` / `errorCorrection` | Error correction: `L`, `M`, `Q`, `H` |

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘Z` / `Ctrl+Z` | Undo |
| `⌘⇧Z` / `Ctrl+Shift+Z` | Redo |
| `⌘E` / `Ctrl+E` | Open export dialog |

---

## Tech stack

- [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling)
- [Zustand](https://zustand.docs.pmnd.rs/)

---

## Deploy to GitHub Pages

This repo is configured for automatic deployment via GitHub Actions.

1. Push your code to the `main` branch on [github.com/ayand269/qr-studio](https://github.com/ayand269/qr-studio).
2. In your repo, go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. After the workflow runs, your site will be live at **https://ayand269.github.io/qr-studio/**

The deploy workflow lives in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and runs on every push to `main`.

### Manual deploy (optional)

```bash
npm run deploy
```

---

## Project structure

```
src/
├── components/     # UI components (preview, customizer, export, batch, etc.)
├── hooks/          # Custom React hooks
├── lib/            # QR generation, colors, storage utilities
├── pages/          # Home and batch routes
├── store/          # Zustand state (QR config, theme)
└── types/          # TypeScript interfaces
```

---

## Privacy

QR Studio runs entirely in your browser. Your QR content and designs are not sent to any server. Saved presets and history are stored in your browser's local storage.

---

## License

MIT — see [LICENSE](LICENSE) for details.
