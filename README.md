# Playwright + BDD (Cucumber) + POM Framework

JavaScript automation framework for **store checkout** using **Playwright**, **Cucumber** (BDD), and the **Page Object Model** design pattern. Includes human-like behavior and stealth settings to improve reliability against anti-bot and payment flows.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Run Tests](#run-tests)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [Scenarios](#scenarios)
- [Configuration](#configuration)
- [Page Objects & Locators](#page-objects--locators)
- [Reports](#reports)
- [Adding New Tests](#adding-new-tests)

---

## Prerequisites

- **Node.js 18, 20, or 22** (LTS recommended; avoid Node 21)
- **npm**
- **Chromium** (installed via `npx playwright install`)

---

## Setup

```bash
npm install
npx playwright install
```

This installs Cucumber, Playwright, and optional stealth plugins. The first run of tests will use the installed Chromium browser.

---

## Run Tests

| Command | Description |
|--------|-------------|
| `npm test` | Run all BDD scenarios (headless). Set `BASE_URL` for store (see [Configuration](#configuration)). |
| `npm run test:headed` | Run all scenarios with the browser window visible. |
| `npm run test:store` | Run **only** `store_checkout.feature` (headless, with `BASE_URL` set to the QA store). |
| `npm run test:store:headed` | Run only store checkout with the browser visible. |
| `npm run test:debug` | Run with Playwright Inspector (pause on failure, step through). |
| `npm run report` | Open the last Playwright HTML report (if generated). |

**Examples:**

```bash
# Store checkout only (recommended for daily runs)
npm run test:store

# Store checkout with visible browser
npm run test:store:headed

# All scenarios (ensure BASE_URL points to your store if all features are store-based)
BASE_URL=https://9975.qa-bkstr.com npm test
```

---

## CI/CD Pipeline

This project includes **automated daily test execution** pipelines for GitHub Actions, GitLab CI, and Azure Pipelines.

### 🚀 Quick Start

- **GitHub Actions**: `.github/workflows/daily-tests.yml`
- **GitLab CI**: `.gitlab-ci.yml`
- **Azure Pipelines**: `azure-pipelines.yml`

All pipelines are configured to:
- ✅ Run automatically every 24 hours (2 AM UTC)
- ✅ Install dependencies and Playwright browsers
- ✅ Execute tests with `npm run test:store`
- ✅ Generate and upload test reports
- ✅ Retain artifacts for 30 days

### 📖 Full Setup Guide

See **[CICD-SETUP.md](./CICD-SETUP.md)** for detailed instructions on:
- Setting up scheduled runs on your platform
- Configuring notifications (Slack, email)
- Customizing schedules and environments
- Viewing test results and artifacts
- Troubleshooting common issues

### 🎯 Choose Your Platform

1. **GitHub Actions** (Recommended) - Easiest setup, runs in GitHub
2. **GitLab CI** - For GitLab repositories
3. **Azure Pipelines** - For Azure DevOps projects

---

## Project Structure

```
StoreCheckout/
├── features/
│   └── store_checkout.feature    # All checkout scenarios (Gherkin)
├── pages/
│   ├── BasePage.mjs              # Base class for all page objects
│   └── store/
│       ├── PasswordPage.mjs      # Store password gate
│       ├── DashboardPage.mjs     # Product listing, click product by ordinal
│       ├── ProductPage.mjs       # Size, quantity, add to cart
│       ├── CartPage.mjs          # Cart review, checkout button
│       └── CheckoutPage.mjs      # Email, address, shipping, payment, financial aid
├── step_definitions/
│   ├── store_checkout.steps.mjs  # Steps for store scenarios
│   └── wait.steps.mjs            # Generic "I wait X seconds"
├── support/
│   ├── world.mjs                 # Playwright browser/context/page, stealth setup
│   ├── hooks.mjs                 # Before/After, default timeout (120s)
│   ├── storeConfig.mjs           # STORE_BASE_URL, VARIANT_PRODUCT_URL
│   ├── humanBehavior.mjs         # humanType, humanClick, humanWait, random delays
│   └── worldTypes.d.ts           # TypeScript types for IDE Go-to-Definition
├── reports/                      # Cucumber HTML report (generated)
├── cucumber.mjs                  # Cucumber config (paths, imports, formatters)
├── playwright.config.js         # Playwright config (used by report tooling)
├── jsconfig.json                # IDE JS/type checking for .mjs and Go-to-Definition
└── package.json
```

---

## Scenarios

All scenarios live in `features/store_checkout.feature`:

| Scenario | Description |
|----------|-------------|
| Checkout process with single credit card | First product → cart → checkout → pay. |
| Checkout with small / Medium / Large variant | Uses fixed **variant product URL** (Small, Medium, Large). |
| Checkout with single discount code | Applies discount code (e.g. AUTOTEST) before pay. |
| Checkout with single gift card | Applies one gift card. |
| Checkout with multiple gift cards | Applies two gift cards. |
| Checkout with multiple discount codes | Applies two discount codes. |
| Checkout with multiple item quantity | First product, quantity 2, then checkout. |
| Checkout with multiple cart items | First product → add to cart → back → second product → add to cart → checkout. |
| Checkout with multiple cart items and financial aid | Two products in cart, then financial aid checkbox + student code + LOOK UP / APPLY FUNDS before payment. |

Variant scenarios (Small/Medium/Large) use a **fixed product URL** so they do not depend on dashboard order. The URL is set in `support/storeConfig.mjs` (`VARIANT_PRODUCT_URL`).

---

## Configuration

### Environment variables

| Variable | Purpose | Default |
|----------|---------|--------|
| `BASE_URL` | Browser context base URL (used by world). | `https://playwright.dev` (overridden by `test:store` to QA store) |
| `STORE_BASE_URL` | Store root for password page and navigation. | `https://9975.qa-bkstr.com` |
| `VARIANT_PRODUCT_URL` | Product page used for Small/Medium/Large variant scenarios. | URL in `support/storeConfig.mjs` |
| `HEADED` | Set to `1` to run with visible browser. | Unset (headless) |
| `DISABLE_HUMAN_BEHAVIOR` | Set to `1` to disable random delays and human-like typing/click. | Unset (human behavior on) |

### Config file

- **`support/storeConfig.mjs`** – Exports `STORE_BASE_URL` and `VARIANT_PRODUCT_URL`. Change defaults or set env vars to point to another environment.

---

## Page Objects & Locators

All selectors are in `pages/store/`. Update them to match your store’s markup.

| Page | Main elements |
|------|----------------|
| **PasswordPage** | Enter-using-password button, password input, submit. Cookie consent dismissal. |
| **DashboardPage** | Product cards, click by ordinal (“first”, “second”, …). |
| **ProductPage** | Size variant (radio), quantity input `input[type="number"][name="quantity"]`, add-to-cart button. |
| **CartPage** | Checkout button. |
| **CheckoutPage** | Email, ship/pickup, name, address, city, state, zip, phone, shipping method, gift/discount field, **financial aid checkbox** (`#fa-checkbox`), **student ID** (`#student-id`), payment iframes (card number, name, expiry, CVV), pay-now button, order-confirmed message. |

The framework uses **human-like behavior** (random delays, typed input, hover-before-click) and **stealth** settings in `world.mjs` to reduce detection and payment failures. Do not remove these unless debugging.

---

## Reports

- **Cucumber HTML report:** `reports/cucumber-report.html` (generated after a run with the default config).
- **Playwright report:** Run `npm run report` to open the last Playwright HTML report if one was generated.

---

## Adding New Tests

1. **Scenarios** – Add or edit scenarios in `features/store_checkout.feature` (or a new `.feature` file under `features/`).
2. **Steps** – Implement or reuse steps in `step_definitions/store_checkout.steps.mjs`. For new page interactions, add methods to the right page object in `pages/store/`.
3. **Page objects** – New pages should extend `BasePage.mjs` and use `humanBehavior.mjs` helpers where appropriate.
4. **Types (IDE)** – If you add new page objects used from steps, extend `support/worldTypes.d.ts` so Go-to-Definition keeps working in the IDE.

---

## License & Credits

- **Playwright** – [playwright.dev](https://playwright.dev)
- **Cucumber** – [cucumber.io](https://cucumber.io)
- Store and flows are for the configured QA store (e.g. 9975.qa-bkstr.com).
