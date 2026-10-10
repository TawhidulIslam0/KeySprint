# KeySprint

KeySprint is an original typing speed practice app inspired by the general idea of online typing tests. It is not affiliated with or a copy of TypingTest.com.

## Features

- Real timed typing test with 15, 30, 60, 120, and 300 second options
- Live net WPM, raw WPM, accuracy, and error counts
- Easy, medium, and hard passages
- Topic selection: mixed, technology, nature, and work
- Light and dark themes
- Results screen with retry
- Recent test history saved in the browser with `localStorage`
- Responsive layout and keyboard-first interaction

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Notes

This version works entirely in the browser; no API key, database, or backend is required. Test history stays in the current browser. Authentication and cross-device sync are not included.
