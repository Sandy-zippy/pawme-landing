# Pending workflow

`pages.yml` here can't be pushed by Claude (the OAuth token used to push the repo doesn't have the `workflow` scope). To activate it, do **either** of:

## A. Refresh local gh scope and re-push

```bash
gh auth refresh -h github.com -s workflow
mv .github-workflows-pending/workflows/pages.yml .github/workflows/pages.yml
git add -A && git commit -m "Enable Pages deploy workflow" && git push
```

## B. Paste via GitHub web UI

1. Open https://github.com/Sandy-zippy/pawme-landing/actions
2. Click **New workflow** → **set up a workflow yourself**
3. Name the file `pages.yml`
4. Paste the contents of `.github-workflows-pending/workflows/pages.yml`
5. Commit
