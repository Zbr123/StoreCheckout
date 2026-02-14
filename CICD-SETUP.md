# CI/CD Pipeline Setup Guide

This project includes CI/CD configurations for three major platforms. Choose the one that matches your version control platform.

## 🚀 Quick Start

All pipelines are configured to:
- ✅ Run automatically every 24 hours (2 AM UTC by default)
- ✅ Run manually when triggered
- ✅ Install dependencies and Playwright browsers
- ✅ Execute automated tests
- ✅ Generate and upload test reports
- ✅ Retain artifacts for 30 days

---

## 1️⃣ GitHub Actions (Recommended)

**File**: `.github/workflows/daily-tests.yml`

### Setup Steps:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD pipeline"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **The schedule is already configured** ✅
   - Runs daily at 2 AM UTC (`0 2 * * *`)
   - To change the time, edit the cron expression in the workflow file

3. **Configure Secrets (Optional)**:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add secret: `BASE_URL` (if different from default)
   - Add `SLACK_WEBHOOK_URL` for Slack notifications (optional)

4. **Manual Trigger**:
   - Go to: Actions → Daily Automated Tests → Run workflow

5. **View Results**:
   - Go to: Actions tab → Select workflow run
   - Download artifacts (test reports, screenshots)

### Customization:

**Change schedule time**:
```yaml
schedule:
  - cron: '0 14 * * *'  # Run at 2 PM UTC daily
  - cron: '0 */12 * * *'  # Run every 12 hours
```

**Run on multiple browsers**:
```yaml
matrix:
  browser: [chromium, firefox, webkit]
```

---

## 2️⃣ GitLab CI

**File**: `.gitlab-ci.yml`

### Setup Steps:

1. **Push your code to GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD pipeline"
   git remote add origin https://gitlab.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Create Pipeline Schedule**:
   - Go to: CI/CD → Schedules
   - Click: "New schedule"
   - **Description**: Daily automated tests
   - **Interval Pattern Type**: Custom
   - **Cron**: `0 2 * * *` (2 AM UTC daily)
   - **Target Branch**: main
   - Click: "Save pipeline schedule"

3. **Configure Variables (Optional)**:
   - Go to: Settings → CI/CD → Variables
   - Add: `BASE_URL` (if different from default)

4. **Manual Trigger**:
   - Go to: CI/CD → Pipelines → Run pipeline

5. **View Results**:
   - Go to: CI/CD → Pipelines → Select run
   - Download artifacts from the job

### Pipeline Features:
- ✅ Uses official Playwright Docker image
- ✅ Caches node_modules for faster runs
- ✅ Retries on runner failures
- ✅ Publishes JUnit test reports

---

## 3️⃣ Azure Pipelines

**File**: `azure-pipelines.yml`

### Setup Steps:

1. **Push your code to Azure Repos**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD pipeline"
   git remote add origin https://dev.azure.com/YOUR_ORG/YOUR_PROJECT/_git/YOUR_REPO
   git push -u origin main
   ```

2. **Create Pipeline**:
   - Go to: Pipelines → Create Pipeline
   - Select: Azure Repos Git
   - Select your repository
   - Choose: Existing Azure Pipelines YAML file
   - Path: `/azure-pipelines.yml`
   - Click: Run

3. **Schedule is Pre-configured** ✅
   - Already set to run daily at 2 AM UTC
   - The schedule is defined in the YAML file

4. **Configure Variables (Optional)**:
   - Go to: Pipelines → Select pipeline → Edit
   - Variables → Add: `BASE_URL`

5. **Manual Trigger**:
   - Go to: Pipelines → Select pipeline → Run pipeline

6. **View Results**:
   - Go to: Pipelines → Select run
   - View: Tests tab for results
   - Download: Artifacts for reports

### Pipeline Features:
- ✅ Multi-browser testing matrix
- ✅ Caches npm dependencies
- ✅ Publishes test results to Tests tab
- ✅ Parallel artifact uploads

---

## 📅 Cron Schedule Reference

Common cron expressions for scheduling:

| Expression | Description |
|------------|-------------|
| `0 2 * * *` | Daily at 2 AM UTC |
| `0 */6 * * *` | Every 6 hours |
| `0 */12 * * *` | Every 12 hours (twice daily) |
| `0 0 * * *` | Daily at midnight UTC |
| `0 9 * * 1-5` | Weekdays at 9 AM UTC |
| `0 0 * * 0` | Every Sunday at midnight |

### Timezone Conversion:
- UTC to your local time: https://www.timeanddate.com/worldclock/converter.html
- Cron expression generator: https://crontab.guru/

---

## 🔔 Setting Up Notifications

### Slack Notifications (GitHub Actions):

1. Create Slack Webhook:
   - Go to: https://api.slack.com/messaging/webhooks
   - Create webhook for your channel

2. Add to GitHub Secrets:
   - Secret name: `SLACK_WEBHOOK_URL`
   - Value: Your webhook URL

3. Uncomment the Slack notification step in workflow file

### Email Notifications:

- **GitHub**: Configure in Settings → Notifications
- **GitLab**: Configure in Settings → Notifications
- **Azure**: Add SendEmail task in pipeline

---

## 📊 Viewing Test Reports

### After each run:

1. **Artifacts** contain:
   - Playwright HTML report
   - Test results JSON
   - Screenshots of failures
   - Error logs

2. **To view HTML report locally**:
   ```bash
   # Download artifacts from CI/CD platform
   # Extract the playwright-report folder
   npx playwright show-report ./playwright-report
   ```

---

## 🛠️ Troubleshooting

### Pipeline not running on schedule:

- **GitHub**: Check Actions → Enable workflows
- **GitLab**: Verify schedule is active in CI/CD → Schedules
- **Azure**: Ensure "always: true" is set in schedule configuration

### Tests failing in CI but passing locally:

- Check environment variables (BASE_URL, etc.)
- Verify Playwright browsers are installed
- Check timeout values for slow CI environments
- Review screenshots in artifacts

### Artifacts not uploading:

- Verify paths in artifact upload configuration
- Check storage limits on your platform
- Ensure artifact upload step runs with `if: always()`

---

## 📝 Best Practices

1. **Start with one platform** - Choose GitHub Actions (easiest), GitLab CI, or Azure Pipelines
2. **Test the pipeline manually first** - Before relying on scheduled runs
3. **Monitor notifications** - Set up Slack/email alerts for failures
4. **Review artifacts regularly** - Clean up old artifacts if storage is limited
5. **Adjust timeouts** - Increase if tests run longer than 60 minutes
6. **Use secrets** - Never commit credentials or API keys

---

## 🎯 Next Steps

1. Choose your CI/CD platform
2. Follow the setup steps above
3. Commit and push the configuration file
4. Trigger a manual run to test
5. Verify the schedule works (wait 24 hours or adjust timing)
6. Set up notifications
7. Monitor and optimize

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
- [Azure Pipelines Documentation](https://docs.microsoft.com/azure/devops/pipelines)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)

---

## 💡 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review CI/CD logs for error messages
3. Verify all prerequisites are met
4. Check platform-specific documentation

Happy Testing! 🚀

