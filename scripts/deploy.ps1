# InvoiceForge — one-command deploy (run after: gh auth login)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host "=== 1. GitHub ===" -ForegroundColor Cyan
$remote = git remote get-url origin 2>$null
if (-not $remote) {
  $user = (gh api user -q .login)
  gh repo create invoiceforge --public --source=. --remote=origin --push
} else {
  git push -u origin main
}

Write-Host "=== 2. Vercel ===" -ForegroundColor Cyan
npx vercel --prod --yes

Write-Host ""
Write-Host "Done! Open your Vercel URL above." -ForegroundColor Green
Write-Host "Next: Create Lemon Squeezy product and set NEXT_PUBLIC_PRO_CHECKOUT_URL in Vercel dashboard."
