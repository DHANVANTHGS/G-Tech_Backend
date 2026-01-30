# Fix GitHub Secret Scanning Issue

## Problem
GitHub is blocking pushes because commit `055dd13` contains Firebase credentials in `config/config.js`.

## Current Status
✅ Current code is clean (no secrets in current version)
❌ Old commit still has secrets in git history

## Solution: Use GitHub Secret Scanning Bypass

### Step 1: Get the Bypass URL
When you tried to push, GitHub provided a URL like:
```
https://github.com/DHANVANTHGS/G-Tech_Backend/security/secret-scanning/unblock-secret/38zQ7TgG307IkAkgqVvtpXZP6qv
```

### Step 2: Visit the URL
1. Open the URL in your browser
2. GitHub will show you the secret that was detected
3. Click "Allow secret" or "Bypass protection"
4. This allows you to push, but the secret remains in history

### Step 3: Push Your Code
```bash
git push origin main
```

## Alternative: Clean Git History (More Secure)

If you want to completely remove the secret from history:

### Option A: Interactive Rebase
```bash
# Start interactive rebase from before the problematic commit
git rebase -i 0de5e43

# In the editor, change 'pick' to 'edit' for commit 055dd13
# Save and close

# Git will stop at that commit
# Edit config/config.js to remove secrets
# Stage the file
git add config/config.js
git commit --amend --no-edit

# Continue rebase
git rebase --continue

# Force push
git push origin --force main
```

### Option B: Create New Branch (Easiest)
```bash
# Create new branch from before the secret commit
git checkout -b main-clean 0de5e43

# Cherry-pick all commits after the secret commit (except 055dd13)
git cherry-pick 34d92ef
git cherry-pick 8873ab0
git cherry-pick 60a3431
git cherry-pick 4157ff2
git cherry-pick 64b1594

# Push new branch
git push origin main-clean

# Then set it as main branch on GitHub
```

## Recommended: Use Bypass URL (Quickest)

For now, use the GitHub bypass URL to push your current clean code. The secret is already exposed in that old commit, so allowing it won't make it worse. Just make sure:

1. ✅ Current code has no secrets (already done)
2. ✅ Use environment variables going forward (already done)
3. ✅ Never commit secrets again

## After Pushing

1. Set environment variables in Render.com:
   - `FIREBASE_CREDENTIALS_BASE64` (base64 encoded JSON)
   - `JWT_SECRET`

2. Verify deployment works

3. Consider rotating the Firebase credentials if they were exposed

