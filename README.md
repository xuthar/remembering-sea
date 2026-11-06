# Remembering Sea

**An ocean of memories — a poetic companion to [MrXuthar on YouTube](https://www.youtube.com/@MrXuthar).**

An English-language, cinematic sea journal with original poetry, photography, ocean films and Shorts.

## What is included

- Cinematic responsive home page, with locally bundled ocean artwork.
- Eight original poems in **The Book of Tides**.
- The shoreline photo gallery with local image fallbacks.
- Separate archive page for full videos and Shorts, with YouTube links.
- Optional privacy-enhanced YouTube embeds for videos whose public metadata is available.
- Daily public YouTube catalog synchronization using `yt-dlp`, retaining confirmed items if scraping is temporarily unavailable.
- One GitHub Actions workflow that deploys on pushes, daily schedule and manual runs.

## Publish to GitHub Pages (one-time repository setting)

1. Open [repository Pages settings](https://github.com/xuthar/remembering-sea/settings/pages).
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open [Publish Remembering Sea](https://github.com/xuthar/remembering-sea/actions/workflows/publish.yml) under **Actions**, choose **Run workflow** and select the `main` branch.
4. When the workflow finishes successfully, visit **https://xuthar.github.io/remembering-sea/**.

The repo is public and the source files are already on `main`. GitHub requires an administrator to configure the Pages publishing source; adding this workflow alone cannot bypass that setting.

## How uploads work

`.github/workflows/publish.yml` triggers on every push to `main`, every morning and by manual dispatch. On scheduled/manual runs, it attempts to retrieve genuine public videos and Shorts using `scripts/sync_youtube.py`, then commits changed catalog data to `content/videos.json` and deploys that exact version of the site. On push runs it deploys without scraping.

No YouTube API keys are required. YouTube may restrict automated scraping, in which case existing confirmed catalog data is preserved and the site still links to the channel directly. Empty initial video/Short grids are intentional; they are never populated with invented titles or metrics.

## Local preview

```sh
python -m http.server 8080
```

Open http://localhost:8080/ and use HTTP rather than `file://` so the browser can load `content/videos.json`.

## Pages and images

The production URL uses the `/remembering-sea/` path. All links and assets within the site are relative, so it also works on a local web server. The hero image is bundled locally; other photography has local fallbacks.

Original project imagery and poetry prepared for Remembering Sea. The site is independently operated and not endorsed by YouTube.
