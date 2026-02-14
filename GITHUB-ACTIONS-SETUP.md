# GitHub Actions - Complete Setup Guide

## 🎯 Step-by-Step Setup

### Step 1: Push Your Code to GitHub

```bash
# If you haven't initialized git yet:
git init

# Add all files
git add .

# Commit
git commit -m "Add daily automated testing pipeline"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Verify Pipeline is Active ✅

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see "Daily Automated Tests" workflow listed

**That's it!** The pipeline is now active and will run automatically.

---

## 🧪 Test It Manually (Don't Wait 24 Hours!)

1. Go to **Actions** tab
2. Click **Daily Automated Tests** (left sidebar)
3. Click **Run workflow** button (right side)
4. Click green **Run workflow** button
5. Watch it run! 🎉

**This is important** - test it manually first to ensure everything works before relying on the schedule.

---

## 📅 Schedule Information

**Current Schedule**: Runs daily at **2 AM UTC**

**Cron Expression**: `0 2 * * *`

### Change the Time

Edit `.github/workflows/daily-tests.yml` line 5-6:

```yaml
schedule:
  - cron: '0 14 * * *'  # Change to 2 PM UTC
```

**Common Schedules**:
- `0 2 * * *` - Daily at 2 AM UTC (current)
- `0 9 * * 1-5` - Weekdays at 9 AM UTC
- `0 */6 * * *` - Every 6 hours
- `0 */12 * * *` - Every 12 hours (twice daily)
- `0 0 * * 0` - Every Sunday at midnight

**Time Converter**: https://www.timeanddate.com/worldclock/converter.html

**Cron Helper**: https://crontab.guru/

---

## 📊 Viewing Test Results

### After Each Run:

1. Go to **Actions** tab
2. Click on the latest workflow run
3. You'll see:
   - ✅ Test execution status
   - 📊 Summary section with details
   - 📦 Artifacts section at the bottom

### Download Reports:

Scroll to bottom → **Artifacts** section → Download:
- `test-results-chromium-X` - Screenshots, test data
- `playwright-report-chromium-X` - Full HTML report

### View HTML Report Locally:

```bash
# After downloading and extracting artifacts
npx playwright show-report ./playwright-report
```

---

## 🔧 Configuration Options

### Run on Multiple Browsers

Edit `.github/workflows/daily-tests.yml` around line 20:

```yaml
matrix:
  browser: [chromium, firefox, webkit]  # Uncomment this line
  # browser: [chromium]  # Comment out this line
```

This will run tests on all three browsers in parallel.

### Change Test Command

Edit line 41 to change which tests run:

```yaml
- name: Run tests
  run: npm run test:store  # Change to: npm test (for all tests)
```

### Add Environment Variables

If you need to set custom BASE_URL or other variables:

1. Go to: Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secret:
   - Name: `BASE_URL`
   - Value: `https://your-custom-url.com`

Then it will automatically be used (already configured in the workflow).

---

## 🔔 Enable Notifications

### Slack Notifications:

**Step 1**: Create Slack Webhook
1. Go to: https://api.slack.com/messaging/webhooks
2. Click "Create your Slack app"
3. Create webhook for your channel
4. Copy webhook URL

**Step 2**: Add to GitHub Secrets
1. Repository → Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Paste your webhook URL
5. Click Add secret

**Step 3**: Uncomment Slack Step
Edit `.github/workflows/daily-tests.yml` (around line 73-82):

```yaml
# Remove the '#' from these lines:
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Daily tests failed! Check GitHub Actions for details."
      }
```

Now you'll get Slack messages when tests fail!

### Email Notifications:

1. Click your profile → **Settings**
2. **Notifications** → **Actions**
3. Check: "Send notifications for failed workflows"
4. Save

---

## 🐛 Troubleshooting

### Pipeline Not Running on Schedule

**Issue**: Pipeline doesn't run at scheduled time

**Solutions**:
- ✅ Ensure the workflow file is on the `main` or `master` branch
- ✅ Check Actions tab → "All workflows" → Verify workflow is enabled
- ✅ New repositories may take first scheduled run up to 24 hours
- ✅ Inactive repositories (no commits for 60 days) have schedules disabled

**Fix for inactive repos**: Make a commit or manually trigger workflow

### Tests Passing Locally but Failing in CI

**Common causes**:
- ❌ Missing environment variables
- ❌ Different timezone (use UTC in tests)
- ❌ Slower CI environment (increase timeouts)
- ❌ Browser/OS differences

**Check**:
1. Download artifacts to see screenshots
2. Check console logs in workflow run
3. Run locally with headless mode: `npm run test:store`

### Artifacts Not Uploading

**Issue**: No artifacts after workflow run

**Check**:
- ✅ Tests actually ran (check logs)
- ✅ `playwright-report/` folder was created
- ✅ Storage limit not exceeded (GitHub: 500MB default)

### Slow Test Execution

**Issue**: Tests timeout or run very slowly

**Solutions**:
- Increase timeout in workflow (line 13): `timeout-minutes: 120`
- Increase Playwright timeout in `support/hooks.mjs`
- Optimize tests to run faster

---

## 📈 Best Practices

### 1. Test the Pipeline First ✅
- Always manually trigger the workflow before relying on schedule
- Verify artifacts are uploaded correctly
- Check all tests pass in CI environment

### 2. Monitor Regularly 👀
- Set up Slack/email notifications
- Check Actions tab weekly for failures
- Review test reports in artifacts

### 3. Keep Artifacts Clean 🧹
- Artifacts are kept for 30 days (configurable)
- Large screenshots can use storage quickly
- Clean up old artifacts if needed

### 4. Document Test Data 📝
- If tests use specific test accounts, document them
- Store credentials in GitHub Secrets
- Don't commit secrets to repository

### 5. Handle Flaky Tests 🔧
- Use retry mechanism (already configured)
- Increase human behavior delays if needed
- Add explicit waits for dynamic content

---

## 🎯 Quick Reference

### Manual Trigger
**Actions → Daily Automated Tests → Run workflow**

### View Results
**Actions → Click run → Scroll down → Download artifacts**

### Change Schedule
**Edit `.github/workflows/daily-tests.yml` → Line 5-6**

### Add Secrets
**Settings → Secrets and variables → Actions → New secret**

### Disable Workflow
**Actions → Daily Automated Tests → ⋯ menu → Disable workflow**

---

## 📊 Workflow Status Badge (Optional)

Add a badge to your README to show workflow status:

```markdown
![Daily Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/daily-tests.yml/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your values.

---

## 🆘 Need Help?

**GitHub Actions Docs**: https://docs.github.com/en/actions

**Playwright CI Docs**: https://playwright.dev/docs/ci

**Check workflow logs**: Actions → Click run → Click job → View detailed logs

---

## ✅ Checklist

- [ ] Pushed code to GitHub
- [ ] Verified workflow appears in Actions tab
- [ ] Triggered manual test run
- [ ] Manual run completed successfully
- [ ] Downloaded and reviewed artifacts
- [ ] Configured notifications (optional)
- [ ] Adjusted schedule if needed (optional)
- [ ] Documented any test data/credentials

---

**You're all set!** 🎉 Your automated testing pipeline will now run every 24 hours automatically.

