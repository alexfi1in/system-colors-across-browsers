# System Colors Across Browsers

Resolved values of all [CSS system color keywords](https://www.w3.org/TR/css-color-4/#css-system-colors) across browsers and operating systems.

Live site: [alexfi1in.github.io/system-colors-across-browsers](https://alexfi1in.github.io/system-colors-across-browsers/)

## Data

Color values are collected from real browsers with native OS light/dark mode. Each file in `data/` stores one browser + OS + theme combination:

```
data/
  chrome-macos-light.json
  chrome-macos-dark.json
  firefox-macos-light.json
  safari-macos-light.json
  ...
```

## Collecting new data

1. Open `tools/collect.html` in the target browser
2. The page detects browser, OS, and current system theme automatically
3. Click **Copy JSON**
4. Save as `data/<filename>.json` (filename shown on the page)
5. Rebuild: `npm run build`

Repeat for each browser and both light/dark OS themes.

## Building

After updating any `data/*.json` file, regenerate `data.js`:

```bash
npm run build
```

## Local preview

Open `index.html` directly in a browser — no server needed.

## Hosting

Static files served via GitHub Pages from the repository root.
