# Bagan Marathon 2026 — Reference Theme Edition

## Files
- `index.html` — page structure
- `style.css` — colors, layout, responsive/mobile styles
- `script.js` — CSV loading, search, categories, pagination, sponsor marquee
- `assets/` — RUNderful logo, Bagan illustration and 3 CSV files

## Preview locally
Use VS Code + Live Server. Open the folder, right-click `index.html`, then choose **Open with Live Server**. Do not double-click the HTML file because browsers block local CSV fetch requests.

## Publish on GitHub Pages
1. Create a public GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Go to Settings → Pages.
4. Select Deploy from a branch → `main` → `/(root)` → Save.
5. Open the published URL shown by GitHub Pages.

## Replace participant lists
Replace `assets/10Km.csv`, `assets/21Km.csv`, and `assets/42Km.csv`, keeping those exact filenames and the same column headings:
`Ticket ID, Full Name, BIB Name, BIB Number, Gender, Category, T-Shirt Size, Remark`.

## Replace sponsor logos
The moving strip currently has 13 placeholders. Add PNG logos to `assets/` and edit the `sponsorMarks` / `slots` section at the bottom of `script.js` to use `<img src="assets/your-logo.png" alt="Sponsor">` inside each `.sponsor-slot`.

## Replace the Bagan background
Replace `assets/bagan-hero.png` with your own panoramic image, keeping the same filename. The `assets/sample.png` fallback/artwork is also retained from the earlier project.

## Privacy
GitHub Pages content is public. Publish participant CSV data only with the event organizer's authorization and participant consent as required. Consider removing Ticket IDs or other sensitive fields if they should not be publicly visible.
