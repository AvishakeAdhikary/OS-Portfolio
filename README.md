# Avishake OS — Portfolio

An interactive, desktop‑OS‑style portfolio. Boots like a real OS, has a lock and login screen, a working window manager, a virtual file system with routes, draggable / resizable / minimizable windows, a music player with a live audio visualizer, a terminal, a settings app with theme and accent customization — and a lot more.

```shell
npm install
npm run dev      # http://localhost:3000
npm run build    # builds to /dist with code‑split per‑app chunks
npm run preview  # preview the production build
```

## What's inside

- **Boot screen** with real asset preloading driving the progress bar.
- **Lock & login** with PIN entry (any 4 digits, or Skip).
- **Window manager** — z‑index, focus, drag, 8‑direction resize, minimize, maximize, per‑app boot animations, taskbar previews.
- **Start menu, taskbar, quick panel, notifications, context menus.**
- **Virtual file system** with drives, folders, shortcuts and text files; navigable via breadcrumbs and reflected in the URL (`#/computer/...`).
- **Apps**
  - **File Explorer** — `Local Disk (C:)`, `Projects (D:)`, `Media (F:)` with real path routes.
  - **Music Player** — bars / wave / circular visualizers, shuffle, repeat, gapless playlist navigation.
  - **Photos** — grid and masonry layouts with keyboard‑navigable lightbox.
  - **Browser** — sandboxed iframe with address bar, bookmarks, history.
  - **Resume** — embedded PDF viewer with download.
  - **Certificates** — searchable gallery.
  - **Timeline** — vertical & horizontal modes.
  - **Github**, **Email**, **Settings**, **Terminal** (try `help`, `neofetch`, `ls`, `cd`, `cat`, `open`), **Search**, **About**.
- **Settings** — theme (light/dark), 7 accent colors, 5 wallpapers, sound, brightness — persisted in `localStorage`.

## Stack

- Vue 3.5 with `<script setup>` everywhere
- Pinia 2 for state (os, windows, fs stores)
- Vue Router 4 with hash history for URL‑addressable apps
- Vite 5 with per‑app code splitting

## Structure

```
src/
  apps/registry.js          ── app metadata + lazy import map
  stores/                   ── os, windows, fs
  router/                   ── hash routing
  components/
    os/                     ── BootScreen, Lock, Login, Desktop, Taskbar,
                               StartMenu, QuickPanel, WindowManager, OsWindow,
                               Wallpaper, ContextMenu, NotificationCenter,
                               DesktopIcon
    apps/                   ── one Vue file per application
  assets/                   ── icons, photos, music, css
```

## License

MIT.
