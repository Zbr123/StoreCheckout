#!/bin/bash
# GitHub Actions Setup Script
# This script helps you push your code to GitHub and activate the CI/CD pipeline

echo "========================================"
echo "GitHub Actions Pipeline Setup"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
fi

echo ""
echo "Current git status:"
git status --short

echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"

echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo ""

echo "2. After creating the repository, run these commands:"
echo ""
echo "   git add ."
echo "   git commit -m 'Add daily automated testing pipeline'"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "3. After pushing, go to your repository:"
echo "   • Click the 'Actions' tab"
echo "   • You should see 'Daily Automated Tests' workflow"
echo "   • Click 'Run workflow' to test it manually"
echo ""

echo "========================================"
echo "Pipeline Features:"
echo "========================================"
echo "✓ Runs automatically every 24 hours (2 AM UTC)"
echo "✓ Can be triggered manually anytime"
echo "✓ Uploads test reports and screenshots"
echo "✓ Keeps artifacts for 30 days"
echo ""

echo "📖 For detailed instructions, see: GITHUB-ACTIONS-SETUP.md"
echo ""

