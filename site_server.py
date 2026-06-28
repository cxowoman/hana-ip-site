#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import http.cookies
import http.server
import json
import os
import secrets
import shutil
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
OUTPUTS = ROOT / "outputs"
DATA_DIR = Path(os.environ.get("HANA_DATA_DIR", str(ROOT))).expanduser().resolve()
SECRET_FILE = DATA_DIR / ".hana-admin-secret"
PUBLISHED_JS_FILE = DATA_DIR / "published-data.js"
PUBLISHED_JSON_FILE = DATA_DIR / "published-data.json"
SEED_PUBLISHED_JS_FILE = OUTPUTS / "published-data.js"
SEED_PUBLISHED_JSON_FILE = OUTPUTS / "published-data.json"
COOKIE_NAME = "hana_admin_session"
SESSION_TTL = timedelta(days=7)
MAX_BODY = 35 * 1024 * 1024
ADMIN_USERNAME = os.environ.get("HANA_ADMIN_USER", "hana31923")
ADMIN_PASSWORD = os.environ.get("HANA_ADMIN_PASSWORD", "vanness00")


def json_response(handler: http.server.BaseHTTPRequestHandler, status: int, payload: dict[str, Any]) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Cache-Control", "no-store")
    handler.end_headers()
    handler.wfile.write(body)


def get_secret() -> bytes:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if SECRET_FILE.exists():
        return SECRET_FILE.read_bytes()
    secret = secrets.token_bytes(32)
    SECRET_FILE.write_bytes(secret)
    try:
        SECRET_FILE.chmod(0o600)
    except OSError:
        pass
    return secret


def sign_session(username: str) -> str:
    expires = int((datetime.now(timezone.utc) + SESSION_TTL).timestamp())
    payload = f"{username}:{expires}".encode("utf-8")
    encoded = base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")
    signature = hmac.new(get_secret(), encoded.encode("ascii"), hashlib.sha256).hexdigest()
    return f"{encoded}.{signature}"


def verify_session(cookie_header: str | None) -> bool:
    if not cookie_header:
        return False
    cookies = http.cookies.SimpleCookie()
    cookies.load(cookie_header)
    morsel = cookies.get(COOKIE_NAME)
    if not morsel:
        return False
    try:
        encoded, signature = morsel.value.split(".", 1)
        expected = hmac.new(get_secret(), encoded.encode("ascii"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return False
        padded = encoded + "=" * (-len(encoded) % 4)
        username, expires = base64.urlsafe_b64decode(padded).decode("utf-8").split(":", 1)
        return username == ADMIN_USERNAME and int(expires) >= int(datetime.now(timezone.utc).timestamp())
    except Exception:
        return False


def safe_payload(data: dict[str, Any]) -> dict[str, Any]:
    allowed = {
        "content",
        "courses",
        "deletedCourses",
        "coaching",
        "experiences",
        "contentPosts",
        "deletedContentPosts",
        "testimonials",
        "deletedTestimonials",
    }
    cleaned = {key: data[key] for key in allowed if key in data}
    version = datetime.now(timezone.utc).isoformat()
    cleaned["version"] = version
    cleaned["publishedAt"] = version
    return cleaned


def write_published_data(data: dict[str, Any]) -> dict[str, Any]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    cleaned = safe_payload(data)
    js = "window.HANA_PUBLISHED_DATA = "
    js += json.dumps(cleaned, ensure_ascii=False, separators=(",", ":"))
    js += ";\n"
    json_text = json.dumps(cleaned, ensure_ascii=False, indent=2)
    for target, text in ((PUBLISHED_JS_FILE, js), (PUBLISHED_JSON_FILE, json_text)):
        fd, tmp_name = tempfile.mkstemp(prefix=f".{target.name}.", dir=str(DATA_DIR))
        with os.fdopen(fd, "w", encoding="utf-8") as tmp:
            tmp.write(text)
        os.replace(tmp_name, target)
    return cleaned


def seed_published_data() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not PUBLISHED_JS_FILE.exists() and SEED_PUBLISHED_JS_FILE.exists():
        shutil.copyfile(SEED_PUBLISHED_JS_FILE, PUBLISHED_JS_FILE)
    if not PUBLISHED_JSON_FILE.exists() and SEED_PUBLISHED_JSON_FILE.exists():
        shutil.copyfile(SEED_PUBLISHED_JSON_FILE, PUBLISHED_JSON_FILE)


class HanaSiteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(OUTPUTS), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path.startswith("/api/session"):
            json_response(self, 200, {"authenticated": verify_session(self.headers.get("Cookie"))})
            return
        if self.path.split("?", 1)[0] == "/published-data.js" and PUBLISHED_JS_FILE.exists():
            self.serve_data_file(PUBLISHED_JS_FILE, "application/javascript; charset=utf-8")
            return
        if self.path.split("?", 1)[0] == "/published-data.json" and PUBLISHED_JSON_FILE.exists():
            self.serve_data_file(PUBLISHED_JSON_FILE, "application/json; charset=utf-8")
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path.startswith("/api/login"):
            self.handle_login()
            return
        if self.path.startswith("/api/logout"):
            self.handle_logout()
            return
        if self.path.startswith("/api/publish"):
            self.handle_publish()
            return
        json_response(self, 404, {"ok": False, "error": "not_found"})

    def read_json_body(self) -> dict[str, Any] | None:
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > MAX_BODY:
            return None
        try:
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8"))
            return data if isinstance(data, dict) else None
        except Exception:
            return None

    def serve_data_file(self, path: Path, content_type: str) -> None:
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def handle_login(self) -> None:
        data = self.read_json_body()
        if not data:
            json_response(self, 400, {"ok": False})
            return
        username_ok = hmac.compare_digest(str(data.get("username", "")), ADMIN_USERNAME)
        password_ok = hmac.compare_digest(str(data.get("password", "")), ADMIN_PASSWORD)
        if not (username_ok and password_ok):
            json_response(self, 401, {"ok": False})
            return
        token = sign_session(ADMIN_USERNAME)
        json_body = json.dumps({"ok": True, "authenticated": True}, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(json_body)))
        self.send_header("Set-Cookie", f"{COOKIE_NAME}={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={int(SESSION_TTL.total_seconds())}")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(json_body)

    def handle_logout(self) -> None:
        body = b'{"ok":true}'
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Set-Cookie", f"{COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def handle_publish(self) -> None:
        if not verify_session(self.headers.get("Cookie")):
            json_response(self, 401, {"ok": False, "error": "unauthorized"})
            return
        data = self.read_json_body()
        if not data:
            json_response(self, 400, {"ok": False, "error": "invalid_payload"})
            return
        published = write_published_data(data)
        json_response(self, 200, {"ok": True, "version": published["version"]})


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve Hana IP site with admin publish API.")
    parser.add_argument("--host", default=os.environ.get("HOST", "127.0.0.1"))
    parser.add_argument("--port", default=int(os.environ.get("PORT", "8088")), type=int)
    args = parser.parse_args()
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    seed_published_data()
    server = http.server.ThreadingHTTPServer((args.host, args.port), HanaSiteHandler)
    print(f"Hana site server running at http://{args.host}:{args.port}")
    print(f"Persistent data directory: {DATA_DIR}")
    server.serve_forever()


if __name__ == "__main__":
    main()
