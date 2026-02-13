import { BasePage } from '../BasePage.mjs';
import { humanClick, humanWait, randomMouseMovement } from '../../support/humanBehavior.mjs';

/** Page object for product detail (size, quantity, add to cart). Replace selectors with your actual locators. */
export class ProductPage extends BasePage {
  constructor(page) {
    super(page, '');
  }

  get selectors() {
    return {
      sizeVariant: '[data-testid="size-select"], select[name="size"], .size-option, button:has-text("{value}"), [data-option="size"]',
      sizeOption: (value) => `button:has-text("${value}"), select[name="size"] option:has-text("${value}"), [data-size="${value}"]`,
      quantityInput: 'input[name="quantity"], [data-testid="quantity"], .quantity-input, input[type="number"]',
      quantitySelect: 'select[name="quantity"], [data-testid="quantity-select"]',
      addToCartBtn: 'button[id="BuyButtons-ProductSubmitButton-AR3NOWk9KR25zdGR2R__add-to-cart"]',
    };
  }

  async waitForProductPage() {
    await this.page.waitForLoadState('domcontentloaded');
    console.log('👀 Looking at product details like a real user...');
    
    // CRITICAL: Spend 3-6 seconds looking at product (Stripe watches this!)
    await humanWait(this.page, 3000, 6000);
    
    await this.page.waitForSelector(this.selectors.addToCartBtn, { timeout: 15000 });
    
    // Multiple mouse movements (simulating reading)
    await randomMouseMovement(this.page);
    await humanWait(this.page, 1000, 1500);
    await randomMouseMovement(this.page);
    
    console.log('✅ Done reviewing product');
  }

  async selectSizeVariant(size) {
    await this.waitForProductPage();
    await humanWait(this.page, 400, 900);
    await humanClick(this.page, `input[type="radio"][value="${size}"]`);
    await humanWait(this.page, 300, 700);
  }

  async selectQuantity(quantity) {
    await humanWait(this.page, 300, 600);
    const qtyInput = this.page.locator(this.selectors.quantityInput);
    const qtySelect = this.page.locator(this.selectors.quantitySelect);
    if (await qtyInput.count() > 0) {
      await qtyInput.first().scrollIntoViewIfNeeded();
      await humanWait(this.page, 200, 400);
      await qtyInput.first().fill(String(quantity));
    } else if (await qtySelect.count() > 0) {
      await qtySelect.selectOption({ label: String(quantity) });
    } else {
      await humanClick(this.page, `button:has-text("${quantity}"), [data-quantity="${quantity}"]`);
    }
    await humanWait(this.page, 200, 500);
  }

  async clickAddToCart() {
    await this.page.waitForSelector(this.selectors.addToCartBtn, { timeout: 10000 });
    
    // CRITICAL: Wait before adding to cart (real users review price, description, etc.)
    console.log('⏳ Pausing before adding to cart (mimicking decision-making)...');
    await humanWait(this.page, 2000, 4000);
    
    await humanClick(this.page, this.selectors.addToCartBtn);
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    
    console.log('✅ Added to cart');
  }
}
