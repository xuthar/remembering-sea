# Creates an independent PUBLIC repository and enables GitHub Pages.
# Prerequisites: Git, GitHub CLI (gh), 'gh auth login'. Never stores credentials.
$ErrorActionPreference = 'Stop'
$repo = 'xuthar/remembering-sea'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is missing. Install Git for Windows.' }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI is missing. Install gh from https://cli.github.com/' }
& gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Please run gh auth login first.' }
Push-Location $PSScriptRoot
try {
  if (-not (Test-Path '.git')) {
    & git init -b main
    if ($LASTEXITCODE -ne 0) { throw 'git init failed' }
    & git add .
    & git commit -m 'Launch Remembering Sea — ocean films and poetry'
    if ($LASTEXITCODE -ne 0) { throw 'git commit failed. Configure git user.name and user.email, then retry.' }
  }
  & gh repo view $repo --json name --jq '.name' *> $null
  if ($LASTEXITCODE -ne 0) {
    & gh repo create $repo --public --source . --remote origin --push --description 'Remembering Sea — an ocean of memories. Poetic companion to MrXuthar on YouTube.'
    if ($LASTEXITCODE -ne 0) { throw 'GitHub repository creation failed' }
  } else {
    $remote = & git remote get-url origin 2>$null
    if ($LASTEXITCODE -ne 0) { & git remote add origin "https://github.com/$repo.git" }
    & git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw 'Push failed. Check that the existing repository is empty, or reconcile its history first.' }
  }
  # GitHub Pages may already be enabled. Ignore a 409/422 if so.
  & gh api --method POST "repos/$repo/pages" -f 'source[branch]=main' -f 'source[path]=/' 2>$null
  Write-Host 'Repository: https://github.com/xuthar/remembering-sea'
  Write-Host 'Once Pages builds successfully: https://xuthar.github.io/remembering-sea/'
  Write-Host 'Next: Actions > Sync YouTube videos and Shorts > Run workflow'
} finally { Pop-Location }