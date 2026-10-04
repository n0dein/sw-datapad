# SW5e Datapad

A personal Star Wars 5e character builder for your phone. It works offline once installed and keeps your characters on your device.

## Put it on your phone (about two minutes)

An installable app needs a web address, and any free static host will do. The easiest:

1. On a computer, open **app.netlify.com/drop** and drag this whole folder onto the page. You get an https address.
2. Open that address in Chrome on your phone.
3. Chrome menu, then **Add to Home screen** (or **Install app**). It now opens full screen with its own icon.

Cloudflare Pages and GitHub Pages work the same way. No account setup beyond the host's own.

After the first load the app caches itself, so it opens with no signal. If you replace the files later, bump `VERSION` in `sw.js` so phones pick up the change.

## Back up your characters

Characters and images live in your browser's storage on that device. Clearing site data erases them. In **Settings** use **Download backup** (or **Copy backup**) now and then. **Restore** brings them back on any device.

## What is in the folder

- `index.html`, `styles.css`, `app.js`: the app
- `rules.js`: the read-only rules math (modifiers, proficiency, saves, HP, AC, force and tech DCs)
- `data.js`: SW5e rules text, generated from the SW5e community database; shown exactly as published
- `lore.js`: Aurabesh letters, words, and story prompts (current canon only)
- `fonts/`: the Aurebesh font by Pixel Sagas, free for personal use (see `FONT-LICENSE.txt`; do not offer the font for download)
- `tools/build_data.py`: regenerates `data.js` from a clone of github.com/christopherfowers/sw5e-database
- `tools/build_single.py`: builds the one-file versions in `dist/`

## Credits

Rules content from the SW5e community (sw5e.com). Star Wars is a trademark of Lucasfilm Ltd. This is an unofficial fan tool for personal use.
