#!/usr/bin/env python3
"""Merge a developer branch into main with strict verification."""
import datetime as dt
import json
import subprocess
import sys
from pathlib import Path


def run_cmd(cmd, check=True):
    print(f"--> {' '.join(cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if check and res.returncode != 0:
        print(f"[ERROR] Command failed: {' '.join(cmd)}\nStdout: {res.stdout}\nStderr: {res.stderr}")
        return False, res.stdout, res.stderr
    return True, res.stdout, res.stderr


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/integrate.py <branch>")
        sys.exit(1)

    branch = sys.argv[1]
    repo_root = Path(__file__).resolve().parent.parent

    # 1. Require clean tree on main
    ok, out, _ = run_cmd(["git", "status", "--porcelain"])
    if out.strip():
        print("[FAIL] Git working tree must be clean before integration.")
        sys.exit(1)

    # 2. Fetch origin
    print("Fetching origin...")
    run_cmd(["git", "fetch", "origin"])

    # 3. Check ownership
    print(f"Checking ownership boundary for origin/{branch}...")
    ok, _, _ = run_cmd([sys.executable, "scripts/check_ownership.py", f"origin/{branch}"])
    if not ok:
        print("[FAIL] Ownership boundary check failed.")
        sys.exit(1)

    # Find expected modules for this branch
    with open("ownership.json", "r", encoding="utf-8") as f:
        ownership = json.load(f)["parts"]
    clean_branch = branch.replace("origin/", "")
    expected_modules = []
    for key, val in ownership.items():
        if clean_branch == key or clean_branch.startswith(key):
            expected_modules = val.get("modules", [])
            break

    # 4. Create throwaway branch
    clean_branch_slug = clean_branch.replace("/", "-")
    try_branch = f"try/{clean_branch_slug}"
    print(f"Creating throwaway branch {try_branch} from main...")
    run_cmd(["git", "checkout", "-B", try_branch, "main"])

    # 5. Merge origin/branch
    print(f"Merging origin/{branch} into {try_branch}...")
    ok, _, err = run_cmd(["git", "merge", "--no-ff", f"origin/{branch}"])
    if not ok:
        print(f"[FAIL] Merge conflict detected:\n{err}")
        run_cmd(["git", "merge", "--abort"], check=False)
        run_cmd(["git", "checkout", "main"])
        run_cmd(["git", "branch", "-D", try_branch])
        sys.exit(1)

    # 6. Run verify.py
    verify_cmd = [sys.executable, "scripts/verify.py"]
    for m in expected_modules:
        verify_cmd.extend(["--expect-module", m])

    print("Running verification script...")
    ok, _, _ = run_cmd(verify_cmd)
    if not ok:
        print("[FAIL] Verification failed. Aborting merge.")
        run_cmd(["git", "checkout", "main"])
        run_cmd(["git", "branch", "-D", try_branch])
        sys.exit(1)

    # 7. Merge to main and tag
    print("Verification succeeded! Fast-forwarding main...")
    run_cmd(["git", "checkout", "main"])
    run_cmd(["git", "merge", "--ff-only", try_branch])
    tag_name = f"integrated/{clean_branch_slug}-{dt.datetime.now(dt.timezone.utc).strftime('%Y%m%d%H%M%S')}"
    run_cmd(["git", "tag", tag_name])

    # 8. Append to INTEGRATION_LOG.md
    log_file = repo_root / "docs" / "INTEGRATION_LOG.md"
    today_str = dt.date.today().isoformat()
    log_entry = f"| {today_str} | {branch} | PASS | Successfully integrated and tagged `{tag_name}` |\n"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(log_entry)

    run_cmd(["git", "add", "docs/INTEGRATION_LOG.md"])
    run_cmd(["git", "commit", "-m", f"docs: log successful integration of {branch}"])

    # 9. Clean up throwaway branch
    run_cmd(["git", "branch", "-D", try_branch])

    print(f"\n[SUCCESS] Successfully merged {branch} into main! Tagged: {tag_name}")


if __name__ == "__main__":
    main()

