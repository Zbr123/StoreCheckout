# Playwright + BDD (Cucumber) + POM Framework

JavaScript automation framework using **Playwright**, **Cucumber** (BDD), and **Page Object Model** design pattern.

## Structure

```
store/
├── features/              # Gherkin .feature files (BDD)
├── pages/                 # Page Object Model
│   ├── BasePage.mjs       # Base class for all pages
│   └── PlaywrightHomePage.mjs
├── step_definitions/      # Cucumber step definitions
├── support/               # World, hooks, config
│   ├── world.mjs          # Playwright browser/context/page lifecycle
│   └── hooks.mjs          # Before/After hooks
├── cucumber.config.js
├── playwright.config.js
├── run-cucumber.mjs       # Cucumber runner
└── package.json
```

## Prerequisites

- **Node.js 18, 20, or 22** (Cucumber 11 does not support Node 21; use 20 or 22 LTS)
- npm

## Setup

```bash
npm install
npx playwright install
```

## Run tests

```bash
# Run all BDD scenarios (headless)
npm test

# Run with browser visible
npm run test:headed

# Debug (Playwright inspector)
npm run test:debug
```

## Reports

- **Cucumber HTML**: `reports/cucumber-report.html`
- **Playwright**: use `npx playwright show-report` if using Playwright reporter

## Example scenario

The included feature `features/playwright_docs.feature`:

1. Opens the Playwright homepage
2. Clicks "Get Started"
3. Asserts we are on the docs and the page title contains "Introduction"

Steps use the **PlaywrightHomePage** page object (POM) and the **PlaywrightWorld** (browser/page from `support/world.mjs`).

## Store checkout scenario

`features/store_checkout.feature` automates the full flow: password page → dashboard → product (size, quantity) → add to cart → checkout (email, address, payment) → pay now → order confirmed.

**Run only store scenario:**

```bash
npm run test:store          # headless
npm run test:store:headed   # browser visible
```

**Locators:** All selectors are placeholders in `pages/store/`. Update them to match your site:

- `PasswordPage.mjs` – enter-using-password button, password input, submit
- `DashboardPage.mjs` – first product link/card
- `ProductPage.mjs` – size variant, quantity, add to cart
- `CartPage.mjs` – checkout button
- `CheckoutPage.mjs` – email, ship/pickup, name, address, city, state, zip, phone, shipping method, card fields, pay now, order-confirmed message

Set store URL via env: `STORE_BASE_URL=https://9975.qa-bkstr.com` (default in `support/storeConfig.mjs`).

## Adding new tests

1. Add a `.feature` file in `features/` with Gherkin (Given/When/Then).
2. Add or reuse step definitions in `step_definitions/`.
3. Use or create page objects in `pages/` that extend `BasePage.mjs`.
