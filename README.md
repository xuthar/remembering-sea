# Remembering Sea

A poetic English-language ocean website and independent companion to the **[MrXuthar YouTube channel](https://www.youtube.com/@MrXuthar)**.

## What's inside

- Cinematic, responsive homepage with an original AI-created dusk-ocean cover image.
- Eight original English sea poems in **The Book of Tides**.
- Ocean photography gallery (licensed Unsplash images, with locally bundled fallbacks).
- Dedicated film/Shorts sections, on-demand YouTube privacy-enhanced embeds, prominent YouTube links.
- Automated daily public YouTube metadata import via `yt-dlp` and GitHub Actions; no API key, no invented videos. The importer is best-effort because YouTube sometimes blocks automated reading.
- No build process: HTML, CSS and JavaScript, suitable for GitHub Pages.

## File structure

- `index.html` — main page
- `poetry.html` — poetry collection
- `archive.html` — films and Shorts archive
- `assets/` — styling, script, favicon, cover and fallback imagery
- `content/videos.json` — confirmed public uploads (initially empty)
- `scripts/sync_youtube.py` — the metadata sync tool
- `.github/workflows/sync-youtube.yml` — daily automation and manual run

## Publish on GitHub Pages

1. Create a **public** GitHub repository named `remembering-sea` under the **xuthar** account. It should be empty (do not select README/.gitignore/license during creation).
2. Upload the contents of this directory **including** the `.github` folder into the root of the repository; or use `publish.ps1` on Windows with Git and the authenticated GitHub CLI (`gh`).
3. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch** → **main** → **/(root)** → **Save**.
4. The target address is `https://xuthar.github.io/remembering-sea/` once Pages has published it. Do not assume it is live until verified.
5. Go to **Actions → Sync YouTube videos and Shorts → Run workflow** to populate the homepage and archive with genuine titles and video/Short IDs. Enable workflow permissions for writing repository content if GitHub asks; scheduled Actions may need a first manual run.

### Publishing from PowerShell

From the extracted folder, install [Git](https://git-scm.com/download/win) and [GitHub CLI](https://cli.github.com/) if needed. Run `gh auth login` interactively. Then run `./publish.ps1` from PowerShell. The script does not delete any repository or overwrite existing files, and requires that the `xuthar/remembering-sea` repository either does not yet exist or is your empty new repository.

## Development preview

From the folder, run `python -m http.server 8080`, then open `http://localhost:8080/`. Avoid opening `index.html` as a `file://` URL because browser security settings can block reading `content/videos.json` locally.

## Notes

- YouTube pages cannot be embedded wholesale due to YouTube browser security policy. The individual embedded video cards appear once valid video IDs are gathered by the sync action. Before that, the site offers direct links to the public channel `/videos` and `/shorts` tabs.
- Photo thumbnails are loaded from `images.unsplash.com` with an `onerror` fallback to local ocean images. The original hero artwork is local, so it never requires a third-party photo server.
- Poetry and site design: original work prepared for Remembering Sea. The cover was generated specifically for the project.
- The site is unofficial and is not endorsed by YouTube.