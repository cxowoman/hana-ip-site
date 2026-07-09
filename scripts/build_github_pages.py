#!/usr/bin/env python3
from __future__ import annotations

import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = ROOT / "outputs"
DOCS = ROOT / "docs"

PUBLIC_EXCLUDES = {
    "EMAIL_SETUP.md",
    "admin.css",
    "admin.html",
    "admin.js",
    "config.example.js",
    "config.js",
    "supabase",
}


def public_index_html(html: str) -> str:
    html = html.replace('        <a href="./admin.html">網站後台</a>\n', "")
    html = html.replace('<script src="./published-data.js?v=3"></script>', '<script src="./published-data.js"></script>')
    html = html.replace('<script src="./script.js?v=49"></script>', '<script src="./script.js"></script>')
    html = html.replace('<script src="./content-posts.js?v=7"></script>', '<script src="./content-posts.js"></script>')
    html = html.replace('<script src="./recovered-data.js?v=2"></script>', '<script src="./recovered-data.js"></script>')
    return html


def copy_public_site() -> None:
    if DOCS.exists():
        shutil.rmtree(DOCS)
    DOCS.mkdir(parents=True)

    for source in OUTPUTS.rglob("*"):
        relative = source.relative_to(OUTPUTS)
        if relative.parts[0] in PUBLIC_EXCLUDES:
            continue
        target = DOCS / relative
        if source.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        if relative.as_posix() == "index.html":
            target.write_text(public_index_html(source.read_text(encoding="utf-8")), encoding="utf-8")
        else:
            shutil.copy2(source, target)

    (DOCS / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    copy_public_site()
    print(f"Built GitHub Pages site at {DOCS}")
