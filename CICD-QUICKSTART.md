# 🚀 CI/CD Pipeline - Quick Start

## ✅ What Was Created

Your project now has CI/CD pipelines that run automatically every 24 hours!

### Files Created:

```
StoreCheckout/
├── .github/
│   └── workflows/
│       ├── daily-tests.yml       ← GitHub Actions (RECOMMENDED)
│       └── README.md             ← GitHub Actions quick reference
├── .gitlab-ci.yml                ← GitLab CI pipeline
├── azure-pipelines.yml           ← Azure Pipelines
├── CICD-SETUP.md                 ← Complete setup guide (READ THIS)
└── CICD-QUICKSTART.md            ← This file
```

---

## 🎯 Choose Your Platform

### Option 1: GitHub Actions (Recommended) ⭐

**Best for**: GitHub repositories, easiest setup

**Next Steps**:
1. Initialize git (if not done):
   ```bash
   git init
   git add .
   git commit -m "Add CI/CD pipeline"
   ```

2. Create GitHub repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. **That's it!** 🎉
   - Pipeline runs automatically at 2 AM UTC daily
   - Go to **Actions** tab to see it in action
   - Manual trigger: Actions → Daily Automated Tests → Run workflow

**Schedule**: Runs daily at 2 AM UTC (`0 2 * * *`)

---

### Option 2: GitLab CI

**Best for**: GitLab repositories

**Next Steps**:
1. Push code to GitLab
2. Go to: **CI/CD → Schedules → New schedule**
3. Set cron: `0 2 * * *`
4. Save and done! ✅

---

### Option 3: Azure Pipelines

**Best for**: Azure DevOps projects

**Next Steps**:
1. Push code to Azure Repos
2. Go to: **Pipelines → Create Pipeline**
3. Select: Existing YAML file → `azure-pipelines.yml`
4. Run! ✅ (Schedule already configured in YAML)

---

## 📅 When Will Tests Run?

**Default**: Every day at **2 AM UTC**

**Want different time?** Edit the cron expression:
- `0 14 * * *` = 2 PM UTC daily
- `0 */12 * * *` = Every 12 hours
- `0 9 * * 1-5` = Weekdays at 9 AM UTC

**Cron helper**: https://crontab.guru/

---

## 🔍 What Happens During Each Run?

1. ✅ Checkout code
2. ✅ Install Node.js 20
3. ✅ Install dependencies (`npm ci`)
4. ✅ Install Playwright browsers
5. ✅ Run tests (`npm run test:store`)
6. ✅ Generate reports
7. ✅ Upload artifacts (screenshots, reports)
8. ✅ Keep for 30 days

---

## 📊 Viewing Results

### GitHub Actions:
1. Go to **Actions** tab
2. Click on latest workflow run
3. Download **Artifacts** (reports, screenshots)
4. View **Summary** for quick overview

### GitLab CI:
1. Go to **CI/CD → Pipelines**
2. Click on latest run
3. Download artifacts from job
4. View test results in Tests tab

### Azure Pipelines:
1. Go to **Pipelines**
2. Click on latest run
3. View **Tests** tab for results
4. Download artifacts for detailed reports

---

## 🛠️ Test the Pipeline Now!

Don't wait 24 hours! Run it manually:

**GitHub**: Actions → Daily Automated Tests → Run workflow

**GitLab**: CI/CD → Pipelines → Run pipeline

**Azure**: Pipelines → Your pipeline → Run pipeline

---

## 📖 Need More Details?

See **[CICD-SETUP.md](./CICD-SETUP.md)** for:
- ✅ Detailed setup instructions
- ✅ Configuring notifications (Slack, email)
- ✅ Customizing the pipeline
- ✅ Troubleshooting tips
- ✅ Best practices

---

## 🎉 You're All Set!

Your automated testing pipeline is ready to go. Just push your code to your chosen platform and let CI/CD do the work!

**Questions?** Check [CICD-SETUP.md](./CICD-SETUP.md) for troubleshooting and advanced configuration.

---

## 🔔 Optional: Set Up Notifications

Get notified when tests fail:

1. **Slack**: Uncomment Slack step in workflow + add webhook secret
2. **Email**: Configure in platform settings
3. **Teams**: Add Teams webhook (similar to Slack)

See [CICD-SETUP.md](./CICD-SETUP.md) for detailed notification setup.

---

Happy Testing! 🚀

