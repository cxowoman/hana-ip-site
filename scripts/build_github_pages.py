#!/usr/bin/env python3
from __future__ import annotations

import base64
import html
import hashlib
import shutil
import os
import json
import re
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = ROOT / "outputs"
DOCS = ROOT / "docs"
CUSTOM_DOMAIN = os.environ.get("HANA_GITHUB_PAGES_DOMAIN", "hana31923.com.tw").strip()
PUBLIC_ORIGIN = f"https://{CUSTOM_DOMAIN}" if CUSTOM_DOMAIN else ""
SOCIAL_IMAGE_BASENAME = "social-preview-home"

PUBLIC_EXCLUDES = {
    "EMAIL_SETUP.md",
    "admin.css",
    "admin.html",
    "admin.js",
    "config.example.js",
    "config.js",
    "supabase",
}


def clean_text(value: object, max_length: int | None = None) -> str:
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    if max_length and len(text) > max_length:
        return text[: max_length - 3].rstrip() + "..."
    return text


def published_data() -> dict:
    try:
        data = json.loads((OUTPUTS / "published-data.json").read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def published_data_version() -> str:
    data = published_data()
    version = str(data.get("version") or date.today().isoformat())
    return re.sub(r"[^0-9A-Za-z._-]+", "-", version).strip("-") or date.today().isoformat()


def file_version(relative_path: str) -> str:
    try:
        return hashlib.sha256((OUTPUTS / relative_path).read_bytes()).hexdigest()[:12]
    except OSError:
        return date.today().isoformat()


def absolute_url(value: str) -> str:
    if value.startswith(("http://", "https://")):
        return value
    if not PUBLIC_ORIGIN:
        return value
    if value.startswith("./"):
        value = value[1:]
    if value.startswith("/"):
        return f"{PUBLIC_ORIGIN}{value}"
    return f"{PUBLIC_ORIGIN}/{value}"


def social_image_from_data_url(image: str, version: str) -> str | None:
    match = re.match(r"^data:image/([a-zA-Z0-9.+-]+);base64,(.+)$", image, re.S)
    if not match:
        return None
    image_type, payload = match.groups()
    extension = {"jpeg": "jpg", "pjpeg": "jpg", "svg+xml": "svg"}.get(image_type.lower(), image_type.lower())
    if extension not in {"jpg", "jpeg", "png", "webp"}:
        return None
    try:
        image_bytes = base64.b64decode(payload, validate=True)
    except Exception:
        return None
    if not image_bytes:
        return None
    target = DOCS / "assets" / f"{SOCIAL_IMAGE_BASENAME}.{extension}"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(image_bytes)
    digest = hashlib.sha256(image_bytes).hexdigest()[:12]
    cache_token = re.sub(r"[^0-9A-Za-z._-]+", "-", version).strip("-") or digest
    return absolute_url(f"/assets/{target.name}?v={cache_token}-{digest}")


def social_preview_values() -> dict[str, str]:
    data = published_data()
    content = data.get("content") if isinstance(data.get("content"), dict) else {}
    hero_title = clean_text(content.get("hero.title")) or "涵捺 Hana｜電商創業・短影音流量變現・IG掛車陪跑"
    hero_body = clean_text(content.get("hero.body"), 180) or (
        "涵捺 Hana 協助個人品牌、創業者與中小企業，把 AI、內容、社群與商品設計串成可追蹤、可優化、可複製的收入成長系統。"
    )
    version = str(data.get("version") or date.today().isoformat())
    hero_image = clean_text(content.get("hero.image")) or "./assets/home-banner-hana.png"
    image_url = social_image_from_data_url(hero_image, version)
    if not image_url:
        image_url = absolute_url(hero_image)
    title = hero_title if "涵捺" in hero_title or "Hana" in hero_title else f"涵捺 Hana｜{hero_title}"
    return {
        "title": title,
        "description": hero_body,
        "image": image_url,
        "image_alt": clean_text(hero_title, 90) or "Hana Banner",
    }


def replace_title(html_text: str, title: str) -> str:
    escaped = html.escape(title, quote=False)
    return re.sub(r"<title>.*?</title>", f"<title>{escaped}</title>", html_text, count=1, flags=re.S)


def replace_meta_content(html_text: str, attr: str, name: str, content: str) -> str:
    escaped = html.escape(content, quote=True)
    pattern = re.compile(
        rf'(<meta\b(?=[^>]*\b{re.escape(attr)}="{re.escape(name)}")(?=[^>]*\bcontent=")[^>]*\bcontent=")[^"]*("[^>]*>)',
        re.S,
    )
    return pattern.sub(lambda match: f"{match.group(1)}{escaped}{match.group(2)}", html_text, count=1)


def replace_asset_version(html_text: str, relative_path: str, version: str) -> str:
    escaped_path = re.escape(relative_path)
    escaped_version = html.escape(version, quote=True)
    pattern = re.compile(rf'((?:href|src)="\./{escaped_path})(?:\?v=[^"]*)?(")')
    return pattern.sub(lambda match: f"{match.group(1)}?v={escaped_version}{match.group(2)}", html_text)


def public_index_html(html: str) -> str:
    preview = social_preview_values()
    html = html.replace('        <a href="./admin.html">網站後台</a>\n', "")
    html = html.replace('    <script src="./config.js"></script>\n', "")
    html = replace_title(html, preview["title"])
    html = replace_meta_content(html, "name", "description", preview["description"])
    html = replace_meta_content(html, "property", "og:title", preview["title"])
    html = replace_meta_content(html, "property", "og:description", preview["description"])
    html = replace_meta_content(html, "property", "og:image", preview["image"])
    html = replace_meta_content(html, "property", "og:image:alt", preview["image_alt"])
    html = replace_meta_content(html, "name", "twitter:title", preview["title"])
    html = replace_meta_content(html, "name", "twitter:description", preview["description"])
    html = replace_meta_content(html, "name", "twitter:image", preview["image"])
    html = re.sub(
        r'<script src="\./published-data\.js(?:\?v=[^"]*)?"></script>',
        f'<script src="./published-data.js?v={published_data_version()}"></script>',
        html,
    )
    html = replace_asset_version(html, "styles.css", file_version("styles.css"))
    html = replace_asset_version(html, "recovered-data.js", file_version("recovered-data.js"))
    html = replace_asset_version(html, "registration-public-config.js", file_version("registration-public-config.js"))
    html = replace_asset_version(html, "script.js", file_version("script.js"))
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
    if CUSTOM_DOMAIN:
        (DOCS / "CNAME").write_text(f"{CUSTOM_DOMAIN}\n", encoding="utf-8")
        (DOCS / "robots.txt").write_text(
            f"User-agent: *\nAllow: /\n\nSitemap: https://{CUSTOM_DOMAIN}/sitemap.xml\n",
            encoding="utf-8",
        )
        (DOCS / "sitemap.xml").write_text(
            f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://{CUSTOM_DOMAIN}/</loc>
    <lastmod>{date.today().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
""",
            encoding="utf-8",
        )


if __name__ == "__main__":
    copy_public_site()
    print(f"Built GitHub Pages site at {DOCS}")
