import { BasePage } from '../BasePage.mjs';
import { humanClick, humanWait, randomMouseMovement, randomScroll } from '../../support/humanBehavior.mjs';

/** Page object for store dashboard / product listing. Replace selectors with your actual locators. */
export class DashboardPage extends BasePage {
  constructor(page) {
    super(page, '');
  }

  get selectors() {
    return {
      firstProduct: 'product-card[class="product-card"]',
      productLink: 'a[href*="/product"], .product-card a, [data-testid="product-link"]',
    };
  }

  async waitForDashboard() {
    await this.page.waitForLoadState('domcontentloaded');
    console.log('🛍️  Browsing products like a real user...');
    
    // CRITICAL: Spend 5-10 seconds browsing (Stripe risk engine watches this!)
    await humanWait(this.page, 5000, 8000);
    
    await this.page.waitForSelector(this.selectors.firstProduct, { timeout: 15000 });
    
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
    await this.waitForDashboard();
    await humanWait(this.page, 1000, 2000); // Look at product before clicking
  
    const firstProduct = this.page.locator(this.selectors.firstProduct).first();
    await firstProduct.scrollIntoViewIfNeeded();
    await humanWait(this.page, 500, 1000);
    await firstProduct.click();
  
    await this.page.waitForLoadState('domcontentloaded');
  }
  
}
