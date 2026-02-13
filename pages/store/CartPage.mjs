import { BasePage } from '../BasePage.mjs';
import { humanClick, humanWait, randomMouseMovement, randomScroll } from '../../support/humanBehavior.mjs';

/** Page object for cart and checkout entry. Replace selectors with your actual locators. */
export class CartPage extends BasePage {
  constructor(page) {
    super(page, '');
  }

  get selectors() {
    return {
      checkoutBtn: 'button[id="checkout"]',
    };
  }

  async waitForCart() {
    await this.page.waitForLoadState('domcontentloaded');
    console.log('🛒 Reviewing cart like a real user...');
    
    // CRITICAL: Spend 7-12 seconds in cart (Stripe risk engine HEAVILY watches this!)
    // Real users review items, prices, shipping before checkout
    await humanWait(this.page, 7000, 12000);
    
    await this.page.waitForSelector(this.selectors.checkoutBtn, { timeout: 15000 });
    
    // Multiple interactions in cart (very important for Stripe scoring!)
    await randomMouseMovement(this.page);
    await humanWait(this.page, 1000, 2000);
    await randomMouseMovement(this.page);
    await humanWait(this.page, 800, 1500);
    
    // Scroll in cart to simulate reading
    await randomScroll(this.page);
    await humanWait(this.page, 1000, 1500);
    
    console.log('✅ Done reviewing cart');
  }

  async clickCheckout() {
    await this.waitForCart();
    
    // CRITICAL: Pause before clicking checkout (decision moment!)
    console.log('⏳ Final pause before proceeding to checkout...');
    await humanWait(this.page, 2000, 4000);
    
    await humanClick(this.page, this.selectors.checkoutBtn);
    await this.page.waitForLoadState('domcontentloaded');
    
    console.log('✅ Proceeding to checkout');
  }
}
