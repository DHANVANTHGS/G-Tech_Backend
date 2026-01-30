# Removing Secrets from Git History

GitHub is blocking pushes because Firebase credentials are in git history (commit 055dd13).

## Solution Options

### Option 1: Use GitHub's Secret Scanning Bypass (Quick but not secure)
1. Visit the URL provided in the error message
2. This will allow the push but the secret remains in history (not recommended)

### Option 2: Remove Secret from Git History (Recommended)

#### Using git filter-branch:
```bash
# Remove the secret from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch config/config.js" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

#### Using BFG Repo-Cleaner (Easier):
1. Download BFG from: https://rtyley.github.io/bfg-repo-cleaner/
2. Run:
```bash
java -jar bfg.jar --delete-files config/config.js
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force
```

### Option 3: Create New Repository (Safest)
1. Create a new repository
2. Copy current code (without secrets)
3. Push to new repo
4. Update deployment URLs

## Current Status
✅ Current code is clean (no secrets)
❌ Old commit (055dd13) still has secrets in history

## Recommended Action
Use Option 2 with git filter-branch to clean history, then force push.

