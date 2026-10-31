# Bagan Marathon 2026 — Premium Participant List

## Files
- `index.html` — page structure
- `style.css` — responsive premium styling
- `script.js` — CSV parsing, search, category tabs, pagination and sponsor animation
- `assets/` — RUNderful logo, 3 participant CSV files and `sample.png` fallback artwork

## Run locally
Do not open `index.html` directly. In VS Code install **Live Server**, right-click `index.html`, and choose **Open with Live Server**.

## Publish on GitHub Pages
1. Create a GitHub repository.
2. Upload the contents of this project folder to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, branch `main`, folder `/(root)`, then Save.
5. Wait for GitHub Pages to provide the public URL.

## Update files
- Replace `assets/10Km.csv`, `assets/21Km.csv`, and `assets/42Km.csv` but keep the filenames and column headings.
- Replace `assets/runderful-logo.jpg` to update the brand logo.
- Replace `assets/sample.png` to change the local fallback artwork.
- Sponsor placeholders (13) are created in `script.js`; replace each placeholder with an `<img>` tag pointing to a sponsor PNG in `assets/`.

## Bagan photo attribution
The hero uses the Wikimedia Commons photograph “Old Bagan, Myanmar, Sunset over ancient 12th century pagodas in Bagan plains” by Vyacheslav Argenberg, licensed CC BY 4.0. Credit and source link are included in the page footer. If the external photo cannot load, the bundled `assets/sample.png` illustration is the fallback.

## Privacy
GitHub Pages content is public. The participant CSVs contain personal registration information; publish only after confirming permission. Remove any columns that should not be public before uploading.
