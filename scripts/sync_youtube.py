#!/usr/bin/env python3
"""Best-effort public YouTube channel sync. No API key or private account access.

Only verified, actually returned YouTube video IDs are written. If YouTube refuses
scraping, previously confirmed results are preserved, not fabricated.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import json
import re
from pathlib import Path
import sys

CHANNEL = "https://www.youtube.com/@MrXuthar"
DEST = Path(__file__).resolve().parent.parent / "content" / "videos.json"
ID = re.compile(r"^[a-zA-Z0-9_-]{11}$")


def fetch_tab(tab: str, limit: int) -> list[dict[str, str]]:
    import yt_dlp
    url = f"{CHANNEL}/{tab}"
    opts = {
        "extract_flat": "in_playlist",
        "skip_download": True,
        "quiet": True,
        "no_warnings": True,
        "ignoreerrors": True,
        "playlistend": limit,
        "socket_timeout": 25,
        "retries": 2,
        "extractor_retries": 2,
        "noplaylist": False,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
    if not info or not isinstance(info, dict) or "entries" not in info:
        raise RuntimeError(f"No playlist entries returned for {url}")
    videos: list[dict[str, str]] = []
    seen = set()
    for item in info.get("entries") or []:
        if not isinstance(item, dict):
            continue
        vid = str(item.get("id") or "")
        title = str(item.get("title") or "").strip()
        if not ID.fullmatch(vid) or vid in seen or not title or title.lower() in {"[private video]", "[deleted video]", "untitled", "na"}:
            continue
        # Some feeds contain posts or unavailable items. Accept only valid video IDs.
        seen.add(vid)
        videos.append({"id": vid, "title": title[:150]})
    if not videos:
        raise RuntimeError(f"No valid public videos found at {url}")
    return videos


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=500)
    args = parser.parse_args()
    previous = json.loads(DEST.read_text(encoding="utf-8")) if DEST.exists() else {"videos": [], "shorts": []}
    result = {"source": CHANNEL, "updated_at": previous.get("updated_at"), "videos": previous.get("videos", []), "shorts": previous.get("shorts", [])}
    successes = 0
    for tab, key in [("videos", "videos"), ("shorts", "shorts")]:
        try:
            fetched = fetch_tab(tab, args.limit)
            # A failed scrape shouldn't overwrite a previously full archive with less data.
            result[key] = fetched
            successes += 1
            print(f"Synced {len(fetched)} verified items from {tab}")
        except Exception as exc:
            print(f"WARNING: {tab} could not be synced: {exc}", file=sys.stderr)
    if not successes:
        print("No confirmed changes; keeping previous archive", file=sys.stderr)
        return 1
    result["updated_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())