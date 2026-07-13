## About

I built this page because I was curious: how do CSS system colors actually resolve across browsers and operating systems — and can you build anything serious on top of them? This is what I found. Data is collected from current (evergreen) browser versions and updated periodically. — Alexey Filin · [GitHub](https://github.com/alexfi1in/system-colors-across-browsers) · [Telegram](https://t.me/alexeyfilin)

## Notes

### Mark and MarkText — the only universal pair
`Mark` = `#ffff00`, `MarkText` = `#000000` across all 10 configurations without exception. If you need one guaranteed system color pair, this is it.

### Chrome fakes AccentColor — but leaks the real one through Highlight
For privacy and fingerprinting protection, Chrome does not expose the user's real `AccentColor` to regular websites, instead returning a hard-coded fallback (`#0075ff` on both macOS and Windows). Firefox returns `#007aff` (macOS blue) and `#0060df` (its own blue on Windows). Safari returns `#007aff` in both themes.

But Chrome does know the real accent: on Windows, `Highlight` returns exactly `#0078d4` — the system accent color. On macOS, Chrome and Safari both return `rgba(128, 188, 254, 0.6)` — a semi-transparent derivative of `#007aff`. Chrome reads the OS accent for text selection but doesn't expose it through `AccentColor`.

### Safari uses transparency throughout
Safari exposes AppKit semantic colors with alpha. In light mode: `GrayText` is `rgba(0,0,0, 0.247)`, `ButtonText` and `FieldText` are `rgba(0,0,0, 0.847)`. In dark mode: `ButtonFace` and `Field` become `rgba(255,255,255, 0.247)`, `ButtonText` and `FieldText` become `rgba(255,255,255, 0.847)`. The hex values in this dataset are alpha-flattened — in dark mode, six keywords collapse to `#ffffff` in the table, but the actual rendered colors composite against the background and remain distinguishable.

### Highlight is the most unpredictable keyword
7 distinct values across 10 configurations, 6 of them semi-transparent under the hood, and contrast polarity flips between platforms: Chrome macOS dark puts dark text on a light selection (`#b3d7ff` + `#000000`), while Chrome Windows dark does the reverse (`#1967d2` + `#ffffff`). `SelectedItem` has even more unique values (8), but only `Highlight` combines high variance with transparency and polarity inversion.

### In dark mode, the OS disappears
Chrome dark returns identical values on macOS and Windows for 17 out of 19 keywords — only `Highlight` and `HighlightText` differ. Firefox matches on 15 out of 19, with `AccentColor`, `Highlight`, `SelectedItem`, and `SelectedItemText` still OS-dependent. Both browsers ship their own dark palette; the OS only leaks through accent and selection colors. In light mode, the picture is different — Chrome diverges on nearly half the keywords between macOS and Windows.

### Chrome Windows light: all link states collapse
`LinkText`, `VisitedText`, and `ActiveText` all resolve to `#0066cc`. No visual distinction between link states. Every other configuration preserves at least some difference.

### ButtonBorder — only Firefox provides a usable one
Firefox returns `#8f8f9d` in all four configs — a consistent mid-gray that works as a visible border. Chrome uses `#000000` / `#ffffff` (in light/dark modes respectively). Safari uses `#ffffff`. If your design relies on `ButtonBorder`, only Firefox delivers.
