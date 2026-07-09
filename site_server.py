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
import subprocess
import sys
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent
OUTPUTS = ROOT / "outputs"
DOCS = ROOT / "docs"
BUILD_GITHUB_PAGES_SCRIPT = ROOT / "scripts" / "build_github_pages.py"
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
AUTO_GIT_PUBLISH = os.environ.get("HANA_AUTO_GIT_PUBLISH", "1").lower() not in {"0", "false", "no"}


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


def published_text(cleaned: dict[str, Any]) -> tuple[str, str]:
    js = "window.HANA_PUBLISHED_DATA = "
    js += json.dumps(cleaned, ensure_ascii=False, separators=(",", ":"))
    js += ";\n"
    json_text = json.dumps(cleaned, ensure_ascii=False, indent=2)
    return js, json_text


def atomic_write_text(target: Path, text: str) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{target.name}.", dir=str(target.parent))
    with os.fdopen(fd, "w", encoding="utf-8") as tmp:
        tmp.write(text)
    os.replace(tmp_name, target)


def write_published_files(target_dir: Path, cleaned: dict[str, Any]) -> None:
    js, json_text = published_text(cleaned)
    for target, text in ((PUBLISHED_JS_FILE, js), (PUBLISHED_JSON_FILE, json_text)):
        atomic_write_text(target_dir / target.name, text)


def run_command(command: list[str], timeout: int = 60) -> dict[str, Any]:
    try:
        result = subprocess.run(
            command,
            cwd=ROOT,
            text=True,
            capture_output=True,
            timeout=timeout,
            check=False,
        )
        return {
            "ok": result.returncode == 0,
            "code": result.returncode,
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
        }
    except Exception as error:
        return {"ok": False, "code": -1, "stdout": "", "stderr": str(error)}


def build_github_pages() -> dict[str, Any]:
    if not BUILD_GITHUB_PAGES_SCRIPT.exists():
        return {"ok": False, "skipped": True, "reason": "missing_build_script"}
    return run_command([sys.executable, str(BUILD_GITHUB_PAGES_SCRIPT)])


def auto_publish_to_git() -> dict[str, Any]:
    if not AUTO_GIT_PUBLISH:
        return {"ok": True, "skipped": True, "reason": "disabled"}
    remote = run_command(["git", "remote"])
    if not remote["ok"]:
        return {"ok": False, "skipped": True, "reason": "git_unavailable", "details": remote}
    if not remote["stdout"].strip():
        return {"ok": True, "skipped": True, "reason": "no_remote"}

    tracked_paths = ["outputs/published-data.js", "outputs/published-data.json", "docs"]
    status = run_command(["git", "status", "--porcelain", "--", *tracked_paths])
    if not status["ok"]:
        return {"ok": False, "skipped": True, "reason": "status_failed", "details": status}
    if not status["stdout"].strip():
        return {"ok": True, "skipped": True, "reason": "no_changes"}

    add = run_command(["git", "add", *tracked_paths])
    if not add["ok"]:
        return {"ok": False, "stage": "add", "details": add}
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    commit = run_command(["git", "commit", "-m", f"Publish site content {timestamp}"])
    if not commit["ok"] and "nothing to commit" not in (commit["stdout"] + commit["stderr"]).lower():
        return {"ok": False, "stage": "commit", "details": commit}
    push = run_command(["git", "push"], timeout=120)
    if not push["ok"]:
        return {"ok": False, "stage": "push", "details": push}
    return {"ok": True, "skipped": False, "commit": commit["stdout"], "push": push["stdout"] or push["stderr"]}


def write_published_data(data: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    cleaned = safe_payload(data)
    write_published_files(DATA_DIR, cleaned)
    write_published_files(OUTPUTS, cleaned)
    build_result = build_github_pages()
    git_result = auto_publish_to_git()
    return cleaned, build_result, git_result


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
        published, build_result, git_result = write_published_data(data)
        json_response(
            self,
            200,
            {
                "ok": True,
                "version": published["version"],
                "staticBuild": build_result,
                "gitPublish": git_result,
            },
        )


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
