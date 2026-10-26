# portfolio_DataAnalyst

Nikhil Kumar's data analytics, machine learning, and AI portfolio.

Plain HTML, CSS and vanilla JavaScript. No build step.

## 1. Run it
Open the folder in VS Code, install **Live Server**, right-click `index.html` → *Open with Live Server*. Or run `python -m http.server` in this folder and open http://localhost:8000.

## 2. Change personal details
`js/config.js` holds email, experience, skills, education and certifications. Page text (hero, headings) is in `index.html`. Colors and fonts are the variables at the top of `css/style.css`.

## 3. Add a project
Open `js/projects.js`, copy an existing object, paste it at the end of the array, and edit. The page rebuilds itself. Leave `githubUrl` / `liveUrl` as `""` and the buttons hide automatically. Only add `metrics` that come from your real repository.

## 4. Configure GitHub
In `js/github.js` set `GITHUB_USERNAME`. Optionally list repo names in `FEATURED_REPOS` to show them first. Results are cached for `CACHE_MINUTES`. No token needed; if GitHub's rate limit is hit, a Retry button appears.

## 5. LinkedIn and email
`js/config.js` → `linkedinUrl` and `email`. The LinkedIn button stays hidden until a URL is set.

## 6. Resume
The resume PDF is `assets/nikhil.pdf`. `js/config.js` → `resumeUrl` controls the Resume section, download, and preview; set it to `""` to hide them.

## 7. Replace screenshots
Save images as `assets/images/hotel-cancellation.png` and `assets/images/ai-agent.png` (or change the `image` path in `projects.js`). Without them, a labelled CSS preview is shown.

## 8. Deploy
**GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from `main` / root. Netlify and Vercel also work by dragging in the folder.

## Notes
- Hero chart data is illustrative only.
- Credential links in `certifications` are empty until you have verification URLs.