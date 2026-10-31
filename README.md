# Bagan Marathon 2026 — Official Participant List

## Project structure
```
Main/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── runderful-logo.jpg
    ├── sample.png
    ├── 10Km.csv
    ├── 21Km.csv
    └── 42Km.csv
```

## Run locally
CSV files are loaded with `fetch()`, so do not open `index.html` by double-clicking it.
In VS Code, install the **Live Server** extension, right-click `index.html`, then choose **Open with Live Server**.

## Publish with GitHub Pages
1. Sign in to GitHub and create a new repository (for example `bagan-marathon-2026`).
2. Extract this ZIP file. Upload the contents of the `Main` folder (not the outer ZIP folder) to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then click **Save**.
6. Wait for GitHub Pages to publish; open the URL shown in the Pages section.

## Update data and images
- Replace `assets/10Km.csv`, `assets/21Km.csv`, and `assets/42Km.csv` with updated CSV files, keeping the same filenames and column headers.
- Keep these columns: `Ticket ID, Full Name, BIB Name, BIB Number, Gender, Category, T-Shirt size, Remark`.
- Replace `assets/runderful-logo.jpg` with your logo (or update its filename in `index.html`).
- Replace `assets/sample.png` with your own Bagan background artwork/photo in PNG format. The current image is a replaceable illustration.
- To add sponsor logos, replace the 13 placeholder boxes: edit the sponsorSlots markup in `script.js` and add image files in `assets/`.

## Important privacy note
GitHub Pages repositories and their published files are public. These CSV files include participant names and registration details. Publish them only if RUNderful Myanmar has permission to make those fields public. If some fields should remain private, remove them from the CSV and adjust the displayed fields in `script.js` before publishing.
