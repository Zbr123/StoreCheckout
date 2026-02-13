import { BasePage } from './BasePage.mjs';

/**
 * Page Object for https://playwright.dev (homepage and docs).
 * POM encapsulates selectors and page-specific actions.
 */
export class PlaywrightHomePage extends BasePage {
  constructor(page) {
    super(page, '/');
  }

  // Selectors (centralized for maintainability)
  get selectors() {
    return {
      navLinkGetStarted: 'a[href="/docs/intro"]',
      navLinkDocs: 'a[href="/docs/intro"]',
      heading: 'h1',
      searchInput: 'input[placeholder*="Search"]',
      docTitle: '.theme-doc-markdown header h1',
    };
  }

  async open() {
    await this.navigate();
  }

  async clickGetStarted() {
    await this.click(this.selectors.navLinkGetStarted);
  }

  async getHeadingText() {
    return this.getText(this.selectors.heading);
  }

  async getDocTitleText() {
    return this.getText(this.selectors.docTitle);
  }

  async searchDocs(query) {
    await this.fill(this.selectors.searchInput, query);
    await this.page.keyboard.press('Enter');
  }

  async isOnDocsPage() {
    return this.page.url().includes('/docs/');
  }
}
