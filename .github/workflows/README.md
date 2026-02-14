# GitHub Actions Workflows

## Daily Automated Tests

**File**: `daily-tests.yml`

### Schedule
- Runs daily at **2 AM UTC**
- Cron: `0 2 * * *`

### What it does
1. Checks out code
2. Sets up Node.js 20
3. Installs dependencies
4. Installs Playwright browsers
5. Runs `npm run test:store`
6. Uploads test reports and screenshots

### Manual Run
1. Go to **Actions** tab
2. Select **Daily Automated Tests**
3. Click **Run workflow**

### View Results
- **Actions** tab → Select run
- Download **Artifacts** for reports and screenshots
- View **Summary** for test overview

### Configuration

**Change schedule time:**
```yaml
schedule:
  - cron: '0 14 * * *'  # 2 PM UTC
```

**Run on multiple browsers:**
```yaml
matrix:
  browser: [chromium, firefox, webkit]
```

**Add secrets:**
- Settings → Secrets and variables → Actions
- Add: `BASE_URL`, `SLACK_WEBHOOK_URL`, etc.

### Notifications

To enable Slack notifications:
1. Uncomment the Slack step in the workflow
2. Add `SLACK_WEBHOOK_URL` secret
3. Get webhook from: https://api.slack.com/messaging/webhooks

---

For complete documentation, see [CICD-SETUP.md](../../CICD-SETUP.md)

