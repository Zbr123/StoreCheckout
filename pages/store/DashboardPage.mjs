import { BasePage } from '../BasePage.mjs';
import { humanClick, humanWait, randomMouseMovement, randomScroll } from '../../support/humanBehavior.mjs';

/** Page object for store dashboard / product listing. Replace selectors with your actual locators. */
export class DashboardPage extends BasePage {
  constructor(page) {
    super(page, '');
  }

  get selectors() {
    return {
      productCard: 'product-card[class="product-card"]',
      productLink: 'a[href*="/product"], .product-card a, [data-testid="product-link"]',
    };
  }

  /**
   * Map ordinal words/numbers to 0-based index: "first" -> 0, "second" -> 1, etc.
   * @param {string} ordinal - "first", "second", "third", "fourth", "fifth", or "1", "2", "3"...
   * @returns {number}
   */
  _ordinalToIndex(ordinal) {
    const normalized = String(ordinal).trim().toLowerCase();
    const words = { first: 0, second: 1, third: 2, fourth: 3, fifth: 4, sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9 };
    if (words[normalized] !== undefined) return words[normalized];
    const num = parseInt(normalized, 10);
    return Number.isNaN(num) ? 0 : Math.max(0, num - 1);
  }

  async waitForDashboard() {
    await this.page.waitForLoadState('domcontentloaded');
    console.log('🛍️  Browsing products like a real user...');
    
    // CRITICAL: Spend 5-10 seconds browsing (Stripe risk engine watches this!)
    await humanWait(this.page, 5000, 8000);
    
    await this.page.waitForSelector(this.selectors.productCard, { timeout: 15000 });
    
    // Multiple mouse movements (more realistic)
    await randomMouseMovement(this.page);
    await humanWait(this.page, 1000, 2000);
    await randomMouseMovement(this.page);
    
    // Scroll multiple times like browsing
    await randomScroll(this.page);
    await humanWait(this.page, 800, 1500);
    await randomScroll(this.page);
    
    console.log('✅ Done browsing products');
  }

  async clickFirstProduct() {
    await this.clickProductByOrdinal('first');
  }

  /**
   * Click the Nth product on the dashboard (e.g. "first", "second", "third", or "1", "2", "3").
   * @param {string} ordinal - "first", "second", "third", "fourth", "fifth", or "1", "2", "3"...
   */
  async clickProductByOrdinal(ordinal) {
    await this.waitForDashboard();
    const index = this._ordinalToIndex(ordinal);
    await humanWait(this.page, 1000, 2000);

    const product = this.page.locator(this.selectors.productCard).nth(index);
    await product.scrollIntoViewIfNeeded();
    await humanWait(this.page, 500, 1000);
    await product.click();

    await this.page.waitForLoadState('domcontentloaded');
  }
}
