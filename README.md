# Bagan Marathon 2026 — Participant List Website

## Project structure
- `index.html` — website structure
- `style.css` — visual design and mobile responsive layout
- `script.js` — CSV loading, category switching, participant search, list/card display, sponsor marquee
- `assets/` — original event assets and participant CSV files

## Sponsor logos
Put sponsor PNG files in the existing `assets` folder with these exact names:
`logo-1.png`, `logo-2.png`, `logo-3.png`, `logo-4.png`, `logo-5.png`, `logo-6.png`, `logo-7.png`, `logo-8.png`, `logo-9.png`, `logo-10.png`, `logo-11.png`, `logo-12.png`, `logo-13.png`.

The sponsor strip moves continuously from left to right. Each logo keeps its original proportions. If a logo file has not been added yet, a simple Sponsor placeholder appears instead.

## Participant CSV files
Keep these files and names inside `assets/`:
- `10Km.csv`
- `21Km.csv`
- `42Km.csv`

Required columns: `Ticket ID, Full Name, BIB Name, BIB Number, Gender, Category, T-Shirt size, Remark`.

## Run locally
Open the folder in Visual Studio Code, install the Live Server extension, right-click `index.html`, then choose **Open with Live Server**. CSV loading will not work reliably when opening the HTML file directly from the file system.

## Publish with GitHub Pages
Upload the project contents to a GitHub repository. Open **Settings → Pages**, choose **Deploy from a branch**, select the `main` branch and `/(root)`, then save.

## Privacy notice
GitHub Pages sites are public. Publish participant details only when authorized by the event organizer and in accordance with participant consent and applicable privacy requirements.
