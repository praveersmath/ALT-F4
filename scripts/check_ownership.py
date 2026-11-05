#!/usr/bin/env python3
"""Check that branch diff does not touch files outside its ownership boundary."""
import fnmatch
import json
import subprocess
import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/check_ownership.py <branch>")
        sys.exit(1)

    branch = sys.argv[1]
    # Clean remote prefix if passed like origin/part/1-data
    clean_branch = branch.replace("origin/", "")

    ownership_file = Path("ownership.json")
    if not ownership_file.exists():
        print("ownership.json not found!")
        sys.exit(1)

    with open(ownership_file, "r", encoding="utf-8") as f:
        ownership = json.load(f)["parts"]

    part_key = None
    for key in ownership:
        if clean_branch == key or clean_branch.startswith(key):
            part_key = key
            break

    if not part_key:
        print(f"Unknown part for branch: {clean_branch}")
        sys.exit(1)

    allowed_globs = ownership[part_key].get("paths", [])
    excluded_globs = ownership[part_key].get("exclude_paths", [])

    # Get diff against main
    cmd = ["git", "diff", "--name-only", f"main...{branch}"]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        # Fallback to direct diff
        cmd = ["git", "diff", "--name-only", "main", branch]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error computing diff: {res.stderr}")
            sys.exit(1)

    changed_files = [line.strip().replace("\\", "/") for line in res.stdout.splitlines() if line.strip()]

    violations = []
    for f in changed_files:
        is_allowed = any(fnmatch.fnmatch(f, pat) for pat in allowed_globs)
        is_excluded = any(fnmatch.fnmatch(f, pat) for pat in excluded_globs)
        if not is_allowed or is_excluded:
            violations.append(f)

    if violations:
        print(f"[ERROR] Branch {branch} violates ownership boundary for {part_key}:")
        for v in violations:
            print(f"  - {v}")
        sys.exit(1)

    print(f"[OK] All {len(changed_files)} changed files comply with {part_key} ownership.")
    sys.exit(0)


if __name__ == "__main__":
    main()

