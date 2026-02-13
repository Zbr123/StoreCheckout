import { BasePage } from '../BasePage.mjs';
import { STORE_BASE_URL } from '../../support/storeConfig.mjs';
import { humanType, humanClick, humanWait } from '../../support/humanBehavior.mjs';

/** Page object for store password gate. Replace selectors with your actual locators. */
export class PasswordPage extends BasePage {
  constructor(page) {
    super(page, '');
    this.storeBaseUrl = STORE_BASE_URL;
  }

  get selectors() {
    return {
      enterUsingPasswordBtn: 'button[id="open-password-overlay"]',
      passwordInput: 'input[id="Password"]',
      submitBtn: 'button[type="submit"]',
    };
  }

  async _clickFirstVisible(selectorString) {
    const selectors = selectorString.split(',').map((s) => s.trim());
    for (const sel of selectors) {
      const loc = this.page.locator(sel).first();
      if (await loc.count() > 0) {
        await loc.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        if (await loc.isVisible()) {
          await loc.click();
          return;
        }
      }
    }
    throw new Error(`No visible element found for: ${selectorString}`);
  }

  async _fillFirstVisible(selectorString, text) {
    const selectors = selectorString.split(',').map((s) => s.trim());
    for (const sel of selectors) {
      const loc = this.page.locator(sel).first();
      if (await loc.count() > 0 && (await loc.isVisible())) {
        await loc.fill(text);
        return;
      }
    }
    throw new Error(`No visible element found for: ${selectorString}`);
  }

  async dismissCookieConsent() {
    try {
      // OneTrust is a common cookie consent platform - check for it first
      const oneTrustSelectors = [
        '#onetrust-accept-btn-handler',  // OneTrust "Accept" button
        'button.onetrust-close-btn-handler',  // OneTrust close button
        '#onetrust-button-group button:first-child',  // First button in OneTrust group
        'button:has-text("Accept All Cookies")',  // Common OneTrust text
        'button:has-text("I Accept")',  // Generic accept
        'button:has-text("Accept")',  // Generic accept
      ];
      
      for (const selector of oneTrustSelectors) {
        const button = this.page.locator(selector).first();
        const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          console.log(`🍪 Cookie consent popup detected (${selector}) - clicking Accept...`);
          await button.click({ force: true });  // Force click to bypass overlay
          await humanWait(this.page, 1000, 1500);  // Wait longer for popup to fully dismiss
          console.log('✅ Cookie consent dismissed');
          return true;
        }
      }
      
      console.log('ℹ️  No cookie consent popup detected');
      return false;
    } catch (e) {
      console.log('⚠️  Error dismissing cookie consent:', e.message);
      return false;
    }
  }

  async openPasswordPage() {
    await this.page.goto(`${this.storeBaseUrl}/password`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await humanWait(this.page, 500, 1000); // Simulate page load observation
    
    // Dismiss cookie/privacy consent if it appears
    await this.dismissCookieConsent();
  }

  async clickEnterUsingPassword() {
    // Ensure cookie consent is dismissed before clicking button
    await this.dismissCookieConsent();
    
    await humanWait(this.page, 300, 700);
    await this._clickFirstVisible(this.selectors.enterUsingPasswordBtn);
    await this.page.waitForSelector(this.selectors.passwordInput, { timeout: 10000 }).catch(() => {});
    await humanWait(this.page, 200, 500);
  }

  async enterPasswordAndSubmit(password) {
    const input = this.page.locator(this.selectors.passwordInput).first();
  
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await humanWait(this.page, 300, 600);
  
    await input.scrollIntoViewIfNeeded();
    await humanType(this.page, this.selectors.passwordInput, password);
    await humanWait(this.page, 400, 800); // Pause before submitting
  
    await this._clickFirstVisible(this.selectors.submitBtn);
    await this.page.waitForLoadState('domcontentloaded');
  }
  
}
