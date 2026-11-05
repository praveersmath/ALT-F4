#!/usr/bin/env python3
"""Run system verification: backend tests, health checks, and frontend checks."""
import argparse
import subprocess
import sys
from pathlib import Path


def run_cmd(cmd, cwd=None):
    print(f"--> Running: {' '.join(cmd)} (cwd={cwd})")
    res = subprocess.run(cmd, cwd=cwd)
    if res.returncode != 0:
        print(f"[FAIL] Command failed with exit code {res.returncode}: {' '.join(cmd)}")
        return False
    return True


def check_health(expected_modules):
    try:
        from fastapi.testclient import TestClient
        # Add backend to sys.path
        backend_dir = Path(__file__).resolve().parent.parent / "backend"
        sys.path.insert(0, str(backend_dir))
        from app.main import app
    except Exception as e:
        print(f"[FAIL] Could not import backend app: {e}")
        return False

    client = TestClient(app)
    resp = client.get("/health")
    if resp.status_code != 200:
        print(f"[FAIL] /health returned HTTP {resp.status_code}")
        return False

    payload = resp.json()
    print(f"Health response: {payload}")

    modules = payload.get("modules", [])
    failed_mods = [m for m in modules if m.get("status") == "failed"]
    if failed_mods:
        print(f"[FAIL] Some modules failed to load: {failed_mods}")
        return False

    loaded_mod_names = {m.get("module") for m in modules if m.get("status") == "loaded"}
    for exp in expected_modules:
        if exp not in loaded_mod_names:
            print(f"[FAIL] Expected module '{exp}' is not loaded. Loaded modules: {loaded_mod_names}")
            return False

    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--expect-module", action="append", default=[], help="Expected module name")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent

    # 1. Backend tests
    backend_dir = repo_root / "backend"
    print("\n--- Running Backend Tests ---")
    if not run_cmd([sys.executable, "-m", "pytest", "-q"], cwd=backend_dir):
        sys.exit(1)

    # 2. Module Health & Loading
    print("\n--- Checking Backend /health & Module Loading ---")
    if not check_health(args.expect_module):
        sys.exit(1)

    # 3. Frontend checks (if frontend exists)
    frontend_dir = repo_root / "frontend"
    pkg_json = frontend_dir / "package.json"
    if pkg_json.exists():
        print("\n--- Checking Frontend ---")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        node_cmd = "node.cmd" if sys.platform == "win32" else "node"
        if not run_cmd([npm_cmd, "ci"], cwd=frontend_dir):
            sys.exit(1)
        if not run_cmd([npm_cmd, "run", "typecheck"], cwd=frontend_dir):
            sys.exit(1)
        if not run_cmd([npm_cmd, "run", "build"], cwd=frontend_dir):
            sys.exit(1)

        token_check = repo_root / "scripts" / "check_ui_tokens.mjs"
        if token_check.exists():
            if not run_cmd([node_cmd, str(token_check)], cwd=repo_root):
                sys.exit(1)

    print("\n[SUCCESS] Verification passed cleanly!")
    sys.exit(0)


if __name__ == "__main__":
    main()

