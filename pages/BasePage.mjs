/**
 * Base Page Object - all page objects extend this.
 * Provides common methods (navigation, waits, generic interactions).
 */
export class BasePage {
  constructor(page, basePath = '') {
    this.page = page;
    this.basePath = basePath;
  }

  async navigate(path = '') {
    const base = (this.basePath || '/').replace(/\/$/, '');
    const seg = (path || '').replace(/^\//, '');
    const url = seg ? `${base}/${seg}` : (base || '/');
    await this.page.goto(url);
  }

  async getTitle() {
    return this.page.title();
  }

  async getPageUrl() {
    return this.page.url();
  }

  async waitForSelector(selector, options = {}) {
    return this.page.waitForSelector(selector, { timeout: 10000, ...options });
  }

  async click(selector) {
    await this.waitForSelector(selector);
    await this.page.click(selector);
  }

  async fill(selector, text) {
    await this.waitForSelector(selector);
    await this.page.fill(selector, text);
  }

  async getText(selector) {
    await this.waitForSelector(selector);
    return this.page.textContent(selector);
  }

  async isVisible(selector) {
    return this.page.isVisible(selector).catch(() => false);
  }

  async selectOption(selector, valueOrLabel) {
    await this.waitForSelector(selector);
    await this.page.selectOption(selector, { label: valueOrLabel });
  }

  async selectOptionByValue(selector, value) {
    await this.waitForSelector(selector);
    await this.page.selectOption(selector, value);
  }
}
