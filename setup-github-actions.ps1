# GitHub Actions Setup Script
# This script helps you push your code to GitHub and activate the CI/CD pipeline

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Actions Pipeline Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git already initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current git status:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Gray
Write-Host ""

Write-Host "2. After creating the repository, run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m 'Add daily automated testing pipeline'" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""

Write-Host "3. After pushing, go to your repository:" -ForegroundColor White
Write-Host "   • Click the 'Actions' tab" -ForegroundColor Gray
Write-Host "   • You should see 'Daily Automated Tests' workflow" -ForegroundColor Gray
Write-Host "   • Click 'Run workflow' to test it manually" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pipeline Features:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Runs automatically every 24 hours (2 AM UTC)" -ForegroundColor Green
Write-Host "✓ Can be triggered manually anytime" -ForegroundColor Green
Write-Host "✓ Uploads test reports and screenshots" -ForegroundColor Green
Write-Host "✓ Keeps artifacts for 30 days" -ForegroundColor Green
Write-Host ""

Write-Host "📖 For detailed instructions, see: GITHUB-ACTIONS-SETUP.md" -ForegroundColor Cyan
Write-Host ""

