## Spiegel

![sc](./image.png)

**Spiegel currently only supports Mac**

** Spiegel** is an AI-assisted knowledge management tool designed to save and automatically organize text, images, URLs and more.

Spiegel quietly watches your clipboard, stores every item in a local SQLite database, and calls an LLM to **auto-categorise, summarise, and tag** each item.

| Feature                  | What it does                                                    |
| ------------------------ | --------------------------------------------------------------- |
| 🧠 **Auto-AI**           | Auto categorizes and tags saved items using an LLM              |
| 🔍 **Instant search**    | Fuzzy-search by plain text **or** tags;                         |
| ⌨️ **Global hotkeys**    | `Ctrl+Shift+S` saves the clip                                   |
| 🌗 **Tauri desktop app** | Native tray icon, zero Electron weight, small memory footprint. |

## Quick start

> **Prerequisites**
>
> - Node 18 + npm
> - Rust toolchain (stable)
> - Tauri CLI: `cargo install tauri-cli --locked`
> - (optional) `OPENAI_API_KEY` if you want AI tagging

```bash
git clone https://github.com/yllkryeziu/spiegel.git
cd spiegel

# 1. install JS deps & Tauri binaries (~3-5 min)
npm install            # uses Vite + Radix UI stack

# 2. run in dev mode (hot-reload Rust + React)
npm run tauri dev
```

First launch creates `~/.spiegel/spiegel.db` and starts listening to your clipboard.

---

## Configuration

| File   | What to change   |
| ------ | ---------------- |
| `.env` | `OPENAI_API_KEY` |

---

