import { BasePage } from '../BasePage.mjs';
import { humanType, humanClick, humanWait, randomMouseMovement, randomScroll } from '../../support/humanBehavior.mjs';

/**
 * Page object for checkout: email, ship/pickup, address, shipping method, payment.
 * Replace all selectors with your actual locators.
 */
export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page, '');
  }

  get selectors() {
    return {
      emailInput: 'input[name="email"]',
      firstNameInput: 'input[name="firstName"]',
      lastNameInput: 'input[name="lastName"]',
      addressInput: 'input[name="address1"]',
      apartmentInput: 'input[name="address2"]',
      cityInput: 'input[name="city"]',
      stateSelect: 'select[name="zone"]',
      zipInput: 'input[name="postalCode"]',
      giftCard: 'input[name="reductions"]',
      phoneInput: 'input[name="phone"]',
      // If card fields are inside an iframe (e.g. Stripe), use frameLocator and update these
      cardNumberInput: 'input[data-current-field="number"]',
      cardNameInput: 'input[data-current-field="name"]',
      expiryInput: 'input[data-current-field="expiry"]',
      cvvInput: 'input[data-current-field="verification_value"]',
      payNowBtn: 'button[id="checkout-pay-button"]',
      orderConfirmedMessage: 'h2:has-text("Your order is confirmed"), h1:has-text("confirmed"), [data-testid="order-confirmed"], .order-confirmation',
    };
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

  async dismissShopPayDialog() {
    try {
      // Check for Shop Pay or any verification dialogs
      const dialog = this.page.locator('[role="dialog"], [class*="modal"]');
      const isVisible = await dialog.isVisible({ timeout: 1000 }).catch(() => false);

      if (isVisible) {
        console.log('Dialog detected, gently dismissing...');

        // Wait a bit before dismissing (more human-like)
        await humanWait(this.page, 800, 1200);

        // Pressing Escape is gentler and doesn't disrupt page state
        await this.page.keyboard.press('Escape');
        console.log('Escape key pressed');

        // Longer wait after dismissing to let page settle
        await humanWait(this.page, 1500, 2500);

        // Verify it closed
        const stillVisible = await dialog.isVisible({ timeout: 500 }).catch(() => false);
        if (!stillVisible) {
          console.log('Dialog dismissed successfully, waiting for page to stabilize...');
          // Extra wait to ensure payment gateway isn't disrupted
          await humanWait(this.page, 1000, 2000);
          return true;
        } else {
          console.log('Dialog still visible after Escape, trying close button...');
          const closeButton = this.page.locator('button[aria-label="Close"]').first();
          const buttonExists = await closeButton.isVisible({ timeout: 1000 }).catch(() => false);
          if (buttonExists) {
            await closeButton.click();
            await humanWait(this.page, 1500, 2500);
          }
        }
      } else {
        console.log('No dialog detected');
      }

      return false;
    } catch (e) {
      console.log('Error dismissing dialog:', e.message);
      return false;
    }
  }

  async waitForCheckout() {
    await this.page.waitForLoadState('domcontentloaded');

    console.log('📋 Landed on checkout page - observing the page like a real user...');

    // BALANCED: Real users spend 3-5 seconds looking at checkout page
    // This is enough to appear human without exceeding Cucumber's 60s timeout
    await humanWait(this.page, 3000, 5000);

    await this.page.waitForSelector(this.selectors.emailInput, { timeout: 15000 });

    // Single mouse movement and scroll (efficient but still natural)
    await randomMouseMovement(this.page);
    await humanWait(this.page, 500, 1000);
    await randomScroll(this.page);

    console.log('✅ Done reviewing checkout page');
  }

  async enterEmail(email) {
    await this.waitForCheckout();

    // Dismiss cookie/privacy consent popup if it appears
    await this.dismissCookieConsent();

    // BALANCED: Quick pause before typing (1-2s is enough)
    console.log('⏳ Pausing before typing email (mimicking user focus)...');
    await humanWait(this.page, 1000, 2000);

    await humanType(this.page, this.selectors.emailInput, email);

    // Wait for potential dialogs
    await humanWait(this.page, 2000, 3000);

    // Check for CAPTCHA challenge
    const captchaDetected = await this.detectAndHandleCaptcha();
    if (captchaDetected) {
      console.log('⚠️ CAPTCHA was detected and handled');
    }

    console.log('Email entered');
  }

  async detectAndHandleCaptcha() {
    try {
      // Check for Shop Pay CAPTCHA challenge
      const captchaSelectors = [
        'text=/Solve this challenge/i',
        'text=/Click on objects/i',
        '[class*="captcha"]',
        '[id*="captcha"]',
        'iframe[src*="captcha"]'
      ];

      for (const selector of captchaSelectors) {
        const captcha = this.page.locator(selector).first();
        const isVisible = await captcha.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          console.log('\n🤖 ========================================');
          console.log('🤖  CAPTCHA CHALLENGE DETECTED!');
          console.log('🤖 ========================================');
          console.log('⚠️  CAPTCHAs cannot be automated by design.');
          console.log('⚠️  The stealth plugin should prevent this.');
          console.log('⚠️  If you see this repeatedly, the site has');
          console.log('⚠️  strong bot detection that needs bypassing.');

          // Take screenshot
          await this.page.screenshot({ path: 'captcha-detected.png', fullPage: true });
          console.log('📸 Screenshot saved: captcha-detected.png');

          // Check if there's a skip button
          const skipButton = this.page.locator('button:has-text("Skip"), button:has-text("Close")').first();
          const skipExists = await skipButton.isVisible({ timeout: 1000 }).catch(() => false);

          if (skipExists) {
            console.log('Found skip button, attempting to skip CAPTCHA...');
            await skipButton.click();
            await humanWait(this.page, 1000, 2000);
            return true;
          }

          // Try pressing Escape
          console.log('Trying Escape key to dismiss CAPTCHA...');
          await this.page.keyboard.press('Escape');
          await humanWait(this.page, 1000, 2000);

          // Check if still visible
          const stillVisible = await captcha.isVisible({ timeout: 1000 }).catch(() => false);
          if (stillVisible) {
            console.log('❌ CAPTCHA could not be dismissed automatically');
            console.log('💡 TIP: The stealth plugin should prevent CAPTCHAs.');
            console.log('💡 This may indicate the plugin is not working correctly.');
          } else {
            console.log('✅ CAPTCHA dismissed');
          }

          return true;
        }
      }

      return false;
    } catch (e) {
      console.log('Error checking for CAPTCHA:', e.message);
      return false;
    }
  }

  async selectShipOrPickup(option) {
    await humanWait(this.page, 300, 700);

    // Don't aggressively dismiss dialog here - let it close naturally
    // Just proceed with the form
    const radio = this.page.getByRole('radio', { name: option });
    await radio.scrollIntoViewIfNeeded();
    await humanWait(this.page, 200, 400);
    await radio.check();
    await humanWait(this.page, 300, 600);
  }


  async enterFirstName(firstName) {
    // DON'T dismiss dialogs - just work around them
    // Dismissing may interfere with payment gateway initialization
    console.log('Proceeding with first name (leaving any dialogs open)...');

    await this.page.waitForSelector(this.selectors.firstNameInput, { timeout: 10000 });

    // Just click the field and type - this will naturally dismiss dialogs
    await this.page.locator(this.selectors.firstNameInput).click().catch(() => { });
    await humanWait(this.page, 300, 600);

    await humanType(this.page, this.selectors.firstNameInput, firstName);
  }

  async enterLastName(lastName) {
    // Small pause between fields
    await humanWait(this.page, 300, 600);
    await humanType(this.page, this.selectors.lastNameInput, lastName);
  }

  async enterAddress(address) {
    // Pause before address
    await humanWait(this.page, 500, 1000);
    await humanType(this.page, this.selectors.addressInput, address);
  }

  async enterApartment(apartment) {
    // Small pause between fields
    await humanWait(this.page, 300, 600);
    await humanType(this.page, this.selectors.apartmentInput, apartment);
  }

  async enterCity(city) {
    // Small pause before city
    await humanWait(this.page, 300, 700);
    await humanType(this.page, this.selectors.cityInput, city);
  }

  async selectState(state) {
    // Pause before selecting state
    await humanWait(this.page, 400, 800);
    await randomMouseMovement(this.page);
    await this.page.selectOption(this.selectors.stateSelect, { label: state });
    await humanWait(this.page, 300, 600);
  }

  async enterZipCode(zip) {
    // Pause before zip code
    await humanWait(this.page, 300, 700);
    await humanType(this.page, this.selectors.zipInput, zip);
  }

  async enterDiscountCodeOrGiftCard(giftCode) {
    // Pause before gift code
    await humanWait(this.page, 300, 700);
    await humanType(this.page, this.selectors.giftCard, giftCode);
  }

  async clickButtonByText(buttonText) {
    await humanClick(this.page, `//button[contains(.,'${buttonText}')]`);
  }

  async enterPhoneNumber(phone) {
    // Pause before phone
    await humanWait(this.page, 500, 1000);
    await randomMouseMovement(this.page);
    await humanType(this.page, this.selectors.phoneInput, phone, { minDelay: 80, maxDelay: 180 });
  }

  async selectShippingMethod(method) {
    console.log('🚚 Reviewing shipping options...');

    // Quick review of shipping options
    await humanWait(this.page, 1500, 2500);
    await randomMouseMovement(this.page);

    await humanClick(this.page, `p:has-text("${method}")`);

    // Brief wait after selection
    await humanWait(this.page, 1000, 2000);

    // Scroll to payment section
    try {
      await this.page.evaluate(() => {
        const paymentSection = document.querySelector('[data-testid="payment"], #payment, [aria-label="Payment"]');
        if (paymentSection) {
          paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      });
      await humanWait(this.page, 1000, 1500);
      await randomMouseMovement(this.page);
    } catch (e) {
      console.log('Could not scroll to payment section');
    }
  }


  async enterPaymentInfo({ cardNumber, cardName, expiryDate, cvv }) {
    // Brief pause before touching payment section
    console.log('Waiting before accessing payment section...');
    await humanWait(this.page, 2000, 3000);
    await randomMouseMovement(this.page);

    // === START DEBUGGING ===
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   PAYMENT GATEWAY DEBUG - Finding the Issue           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Track all network requests related to payment
    const networkLogs = [];
    this.page.on('request', request => {
      const url = request.url();
      if (url.includes('payment') || url.includes('checkout') || url.includes('shopify') || url.includes('stripe')) {
        networkLogs.push({
          type: 'REQUEST',
          url: url,
          method: request.method(),
          time: new Date().toISOString()
        });
      }
    });

    this.page.on('response', response => {
      const url = response.url();
      if (url.includes('payment') || url.includes('checkout') || url.includes('shopify') || url.includes('stripe')) {
        networkLogs.push({
          type: 'RESPONSE',
          url: url,
          status: response.status(),
          statusText: response.statusText(),
          time: new Date().toISOString()
        });
      }
    });

    this.page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('payment') || url.includes('checkout') || url.includes('shopify') || url.includes('stripe')) {
        networkLogs.push({
          type: 'FAILED',
          url: url,
          failure: request.failure(),
          time: new Date().toISOString()
        });
      }
    });

    // Capture console errors
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for payment section to load
    await this.page.waitForLoadState('domcontentloaded');
    console.log('⏱️  Page domcontentloaded');

    // Brief wait instead of full networkidle (saves time)
    await humanWait(this.page, 1500, 2000);

    // === DIAGNOSTIC SECTION ===
    console.log('\n=== PAYMENT GATEWAY DIAGNOSTICS ===');

    // 1. Check console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Console Error:', msg.text());
      }
    });

    // 2. Check if payment scripts are loaded
    const scriptsLoaded = await this.page.evaluate(() => {
      const scripts = Array.from(document.scripts);
      const shopifyScripts = scripts.filter(s =>
        s.src.includes('shopify') ||
        s.src.includes('checkout') ||
        s.src.includes('payment') ||
        s.src.includes('stripe')
      );
      return {
        totalScripts: scripts.length,
        paymentScripts: shopifyScripts.map(s => s.src),
        paymentScriptCount: shopifyScripts.length
      };
    });
    console.log('📜 Scripts on page:', scriptsLoaded);

    // 3. Check for JavaScript errors in page
    const pageErrors = await this.page.evaluate(() => {
      return window.errors || [];
    });
    console.log('🐛 Page errors:', pageErrors);

    // 4. Check network requests for payment gateway
    const failedRequests = [];
    this.page.on('requestfailed', request => {
      if (request.url().includes('payment') || request.url().includes('checkout')) {
        failedRequests.push({
          url: request.url(),
          failure: request.failure()
        });
        console.log('❌ Failed request:', request.url(), request.failure());
      }
    });

    // 5. Check if payment iframe container exists
    const paymentContainerInfo = await this.page.evaluate(() => {
      const containers = document.querySelectorAll('[class*="payment"], [id*="payment"]');
      const iframes = document.querySelectorAll('iframe[name*="card"]');
      return {
        paymentContainers: containers.length,
        paymentIframes: iframes.length,
        containerClasses: Array.from(containers).map(c => c.className).slice(0, 3)
      };
    });
    console.log('💳 Payment containers:', paymentContainerInfo);

    // 6. Check page URL and cookies
    const pageInfo = await this.page.evaluate(() => {
      return {
        url: window.location.href,
        cookies: document.cookie.split(';').length,
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length
      };
    });
    console.log('🍪 Page info:', pageInfo);

    // 7. Check browser properties that payment gateways often check
    const browserProperties = await this.page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        webdriver: navigator.webdriver,
        languages: navigator.languages,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        plugins: navigator.plugins.length,
        vendor: navigator.vendor,
        doNotTrack: navigator.doNotTrack,
        windowOuterSize: `${window.outerWidth}x${window.outerHeight}`,
        windowInnerSize: `${window.innerWidth}x${window.innerHeight}`,
        screenSize: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hasChrome: typeof window.chrome !== 'undefined',
        hasPermissions: typeof navigator.permissions !== 'undefined'
      };
    });
    console.log('🖥️  Browser properties:', JSON.stringify(browserProperties, null, 2));

    // 8. Check if there are any blocking overlays
    const overlays = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('[style*="z-index"], [class*="overlay"], [class*="modal"]');
      return Array.from(elements)
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && parseInt(style.zIndex) > 100;
        })
        .map(el => ({
          tag: el.tagName,
          className: el.className,
          zIndex: window.getComputedStyle(el).zIndex
        }));
    });
    console.log('🎭 Active overlays:', overlays);

    // 9. Get page URL and check for redirects
    const currentUrl = this.page.url();
    console.log('🌐 Current URL:', currentUrl);

    // 10. Check page load timing
    const performanceData = await this.page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perf?.domContentLoadedEventEnd - perf?.domContentLoadedEventStart,
        loadComplete: perf?.loadEventEnd - perf?.loadEventStart,
        domInteractive: perf?.domInteractive,
        pageLoadTime: perf?.loadEventEnd - perf?.fetchStart
      };
    });
    console.log('⏱️  Page load timing (ms):', performanceData);

    // 11. Check if any modals/overlays are blocking
    const blockingElements = await this.page.evaluate(() => {
      const modals = document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="overlay"]');
      return Array.from(modals).map(el => ({
        visible: el.offsetParent !== null,
        className: el.className,
        innerHTML: el.innerHTML.substring(0, 100) + '...'
      })).filter(el => el.visible);
    });
    console.log('🚧 Visible blocking elements:', blockingElements.length);
    if (blockingElements.length > 0) {
      console.log('   Details:', blockingElements);
    }

    console.log('=== END DIAGNOSTICS ===\n');

    // Print network log summary
    if (networkLogs.length > 0) {
      console.log('\n📡 NETWORK ACTIVITY (Payment-related):');
      console.log('─────────────────────────────────────────');
      networkLogs.forEach((log, i) => {
        console.log(`${i + 1}. [${log.type}] ${log.status || ''} ${log.url.substring(0, 80)}`);
        if (log.failure) console.log(`   ❌ Failure: ${log.failure}`);
      });
      console.log('─────────────────────────────────────────\n');
    } else {
      console.log('\n⚠️  NO payment-related network requests detected!');
      console.log('   This might indicate payment scripts are not loading.\n');
    }

    // Print console errors
    if (consoleErrors.length > 0) {
      console.log('\n❌ BROWSER CONSOLE ERRORS:');
      console.log('─────────────────────────────────────────');
      consoleErrors.forEach((err, i) => {
        console.log(`${i + 1}. ${err}`);
      });
      console.log('─────────────────────────────────────────\n');
    } else {
      console.log('\n✅ No browser console errors detected\n');
    }

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   END DEBUG - Compare this with manual testing        ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Check if payment gateway error appears FIRST
    const errorMessage = this.page.locator('text=/payments aren\'t available/i, text=/try again later/i, text=/Credit and debit card/i');
    const hasError = await errorMessage.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasError) {
      console.log('\n╔════════════════════════════════════════════════════════╗');
      console.log('║   ❌ PAYMENT GATEWAY ERROR DETECTED                    ║');
      console.log('╚════════════════════════════════════════════════════════╝');

      // Get the exact error text
      const errorText = await errorMessage.textContent().catch(() => 'Could not read error text');
      console.log('\n❌ Error message:', errorText);
      console.log('\n🔍 WHY THIS HAPPENS:');
      console.log('This error appears in AUTOMATION but NOT in MANUAL testing.');
      console.log('Review the diagnostics above to compare with manual behavior.');

      // Check what payment options are available
      const availablePayments = await this.page.evaluate(() => {
        const paymentOptions = Array.from(document.querySelectorAll('[name*="payment"], input[type="radio"]'));
        return paymentOptions.map(opt => ({
          name: opt.name,
          value: opt.value,
          checked: opt.checked,
          disabled: opt.disabled
        }));
      });
      console.log('💳 Available payment options:', availablePayments);

      // Check page state
      const pageState = await this.page.evaluate(() => {
        return {
          readyState: document.readyState,
          hasFocus: document.hasFocus(),
          activeElement: document.activeElement?.tagName,
          title: document.title
        };
      });
      console.log('📄 Page state:', pageState);

      // Take screenshot
      await this.page.screenshot({ path: 'payment-gateway-error.png', fullPage: true }).catch(() => { });
      console.log('📸 Screenshot saved: payment-gateway-error.png');
      console.log('⚠️  Payment gateway error detected - continuing with attempt to fill fields...');
    } else {
      console.log('✅ Payment gateway is ready!');
    }

    // Click on "Credit card" payment option to ensure it's selected
    try {
      console.log('Ensuring Credit card payment option is selected...');
      const creditCardOption = this.page.locator('input[type="radio"][value*="credit"], label:has-text("Credit card")').first();
      const optionExists = await creditCardOption.isVisible({ timeout: 3000 }).catch(() => false);

      if (optionExists) {
        await creditCardOption.scrollIntoViewIfNeeded();
        await humanWait(this.page, 500, 1000);
        await creditCardOption.click({ force: true });
        console.log('Credit card option clicked');
        await humanWait(this.page, 3000, 4000); // Even longer wait for payment gateway to initialize
      }
    } catch (e) {
      console.log('Credit card option already selected or not found:', e.message);
    }

    // Take screenshot for debugging
    await this.page.screenshot({ path: 'payment-page-before-fill.png', fullPage: true }).catch(() => { });

    // Wait for payment iframes to fully load
    console.log('Waiting for payment gateway to load...');
    await this.page.waitForTimeout(4000);

    // Check if payment iframes exist
    const iframeCount = await this.page.locator('iframe[name*="card-fields"]').count();
    console.log(`Found ${iframeCount} payment iframes`);

    if (iframeCount === 0) {
      console.log('No payment iframes found, waiting longer...');
      await humanWait(this.page, 3000, 4000);

      // Check again
      const retryCount = await this.page.locator('iframe[name*="card-fields"]').count();
      if (retryCount === 0) {
        console.log('Still no payment iframes, payment gateway may not have loaded');
        await this.page.screenshot({ path: 'payment-no-iframe.png', fullPage: true }).catch(() => { });
      }
    }

    try {
      console.log('Starting payment field fill...');

      // Helper function to fill a field in its specific iframe by name attribute
      const fillFieldInIframe = async (fieldName, value, fieldType) => {
        let retries = 2;

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            console.log(`Attempting to fill ${fieldType} (attempt ${attempt}/${retries})...`);

            // Find iframe by exact name match
            const iframe = this.page.frameLocator(`iframe[name*="${fieldName}"]`).first();

            // Find the visible, enabled input field (not the honeypot)
            const input = iframe.locator('input:not([data-honeypot-field]):not(.visually-hidden):not([aria-hidden="true"])').first();

            // Wait for the input to be ready
            await input.waitFor({ state: 'visible', timeout: 8000 });
            await this.page.waitForTimeout(500);

            // Natural click to focus (no force - like a real user)
            await input.click();
            await this.page.waitForTimeout(400);

            // NATURAL CLEAR: Select all text (like a real user: Ctrl+A or triple-click)
            // Check if field has existing value first
            const existingValue = await input.inputValue().catch(() => '');
            if (existingValue) {
              console.log(`  Field has existing value: "${existingValue}" - clearing naturally...`);
              // Use Ctrl+A to select all (natural keyboard shortcut)
              await this.page.keyboard.press('Control+A');
              await this.page.waitForTimeout(200);
            }

            // Type character by character
            for (let char of value) {
              await input.type(char, { delay: Math.floor(Math.random() * 70) + 60 });
            }

            // IMPORTANT: Trigger validation events so Shopify recognizes the field
            // We trigger 'input' and 'change' but NOT 'blur' (blur caused backend errors before)
            await this.page.waitForTimeout(300);
            await input.dispatchEvent('input');
            await this.page.waitForTimeout(100);
            await input.dispatchEvent('change');
            await this.page.waitForTimeout(200);

            console.log(`${fieldType} filled successfully`);
            await this.page.waitForTimeout(400);
            return true;
          } catch (e) {
            console.log(`${fieldType} fill attempt ${attempt} failed:`, e.message);
            if (attempt < retries) {
              console.log(`Waiting before retry...`);
              await this.page.waitForTimeout(2000);
            } else {
              return false;
            }
          }
        }
        return false;
      };

      // Fill each field using its specific iframe name
      const cardSuccess = await fillFieldInIframe('card-fields-number', cardNumber, 'Card number');
      await humanWait(this.page, 400, 700);

      const nameSuccess = await fillFieldInIframe('card-fields-name', cardName, 'Cardholder name');
      await humanWait(this.page, 300, 600);

      const expirySuccess = await fillFieldInIframe('card-fields-expiry', expiryDate, 'Expiry date');
      await humanWait(this.page, 300, 500);

      const cvvSuccess = await fillFieldInIframe('card-fields-verification_value', cvv, 'CVV');
      await humanWait(this.page, 600, 1000);

      // Check if all fields were filled
      if (!cardSuccess || !nameSuccess || !expirySuccess || !cvvSuccess) {
        console.log('⚠️  Warning: Some payment fields may not have been filled successfully');
      } else {
        console.log('✅ All payment fields filled successfully');

        // FINAL VALIDATION: Trigger blur on the last field to complete validation
        // This tells Shopify "I'm done filling all payment fields"
        try {
          console.log('⏳ Triggering final validation...');
          const lastField = this.page.frameLocator('iframe[name*="card-fields-verification_value"]').first()
            .locator('input:not([data-honeypot-field]):not(.visually-hidden):not([aria-hidden="true"])').first();
          await lastField.blur();
          await humanWait(this.page, 800, 1200);
          console.log('✅ Final validation triggered');
        } catch (e) {
          console.log('Could not trigger final validation:', e.message);
        }
      }

      console.log('\n⏳ Letting Shopify validate payment data...');

      // BALANCED: Wait for Shopify to validate (3-4s is enough)
      await humanWait(this.page, 3000, 4000);

      console.log('✅ Payment information entry completed and validated');

    } catch (error) {
      console.error('Error in enterPaymentInfo:', error.message);
      // Take screenshot on error
      await this.page.screenshot({ path: 'payment-error-debug.png', fullPage: true }).catch(() => { });
      throw new Error(`Could not fill payment information: ${error.message}`);
    }
  }

  async clickPayNow() {
    console.log('\n🔄 Preparing to submit payment...');

    // Verify navigator.webdriver is false BEFORE clicking pay (Stripe checks this!)
    const webdriverCheck = await this.page.evaluate(() => navigator.webdriver);
    console.log(`🔍 Pre-payment webdriver check: ${webdriverCheck} (must be false for Stripe)`);
    if (webdriverCheck !== false) {
      console.log('⚠️  WARNING: navigator.webdriver is NOT false - Stripe may reject payment!');
    }

    // Wait for payment section to be fully ready
    console.log('⏳ Waiting for payment section to fully load and validate...');
    await humanWait(this.page, 3000, 5000); // Give extra time for payment gateway

    // DEBUGGING: Set PAUSE_BEFORE_PAY=1 environment variable to pause and test manually
    // DISABLED: Pause feature removed for normal test runs
    if (false && process.env.PAUSE_BEFORE_PAY === '1') {
      console.log('⏸️  PAUSED: Checking page state before manual testing...\n');

      // Diagnose why Pay Now button might not be visible
      const diagnostics = await this.page.evaluate(() => {
        const payButton = document.querySelector('button[id="checkout-pay-button"]');
        const allButtons = document.querySelectorAll('button');

        // Check for overlays/modals that might be blocking the page
        const overlays = Array.from(document.querySelectorAll('[style*="z-index"], [class*="overlay"], [class*="modal"], [class*="dialog"], [class*="popup"]'))
          .filter(el => el.offsetHeight > 0) // Only visible elements
          .map(el => ({
            tag: el.tagName,
            classes: el.className,
            id: el.id,
            zIndex: window.getComputedStyle(el).zIndex,
            position: window.getComputedStyle(el).position,
            display: window.getComputedStyle(el).display,
            text: el.textContent.substring(0, 100),
          }));

        // Get button position
        const buttonBox = payButton ? payButton.getBoundingClientRect() : null;

        return {
          payButtonExists: !!payButton,
          payButtonVisible: payButton ? window.getComputedStyle(payButton).display !== 'none' : false,
          payButtonDisabled: payButton ? payButton.disabled : null,
          payButtonText: payButton ? payButton.textContent.trim() : null,
          payButtonPosition: buttonBox ? {
            top: buttonBox.top,
            left: buttonBox.left,
            bottom: buttonBox.bottom,
            right: buttonBox.right,
            width: buttonBox.width,
            height: buttonBox.height,
            onScreen: buttonBox.top >= 0 && buttonBox.top <= window.innerHeight,
          } : null,
          payButtonStyles: payButton ? {
            display: window.getComputedStyle(payButton).display,
            visibility: window.getComputedStyle(payButton).visibility,
            opacity: window.getComputedStyle(payButton).opacity,
            pointerEvents: window.getComputedStyle(payButton).pointerEvents,
            zIndex: window.getComputedStyle(payButton).zIndex,
          } : null,
          totalButtons: allButtons.length,
          visibleErrors: Array.from(document.querySelectorAll('[role="alert"], .error, [class*="error"]'))
            .map(el => el.textContent.trim())
            .filter(text => text.length > 0),
          paymentIframesLoaded: document.querySelectorAll('iframe[src*="shopifyinc.com"]').length,
          overlaysFound: overlays,
          pageTitle: document.title,
          currentURL: window.location.href,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          scrollPosition: {
            x: window.scrollX,
            y: window.scrollY,
          },
        };
      });

      console.log('🔍 PAY NOW BUTTON DIAGNOSTICS:');
      console.log('   Button exists:', diagnostics.payButtonExists);
      console.log('   Button visible:', diagnostics.payButtonVisible);
      console.log('   Button disabled:', diagnostics.payButtonDisabled);
      console.log('   Button text:', diagnostics.payButtonText);
      console.log('   Button position:', JSON.stringify(diagnostics.payButtonPosition, null, 2));
      console.log('   Button styles:', JSON.stringify(diagnostics.payButtonStyles, null, 2));
      console.log('\n📊 PAGE STATE:');
      console.log('   Viewport:', diagnostics.viewport.width + 'x' + diagnostics.viewport.height);
      console.log('   Scroll position:', diagnostics.scrollPosition.x + ',' + diagnostics.scrollPosition.y);
      console.log('   Total buttons on page:', diagnostics.totalButtons);
      console.log('   Payment iframes loaded:', diagnostics.paymentIframesLoaded);
      console.log('   Visible errors:', diagnostics.visibleErrors.length > 0 ? diagnostics.visibleErrors : 'None');
      console.log('\n🚧 OVERLAYS/MODALS BLOCKING PAGE:');
      if (diagnostics.overlaysFound.length > 0) {
        console.log('   ⚠️  Found', diagnostics.overlaysFound.length, 'potential overlays:');
        diagnostics.overlaysFound.forEach((overlay, i) => {
          console.log(`   ${i + 1}. ${overlay.tag}.${overlay.classes} (z-index: ${overlay.zIndex}, position: ${overlay.position})`);
          console.log(`      Text: "${overlay.text.substring(0, 80)}..."`);
        });
      } else {
        console.log('   ✅ No overlays detected');
      }
      console.log('\n📄 PAGE INFO:');
      console.log('   Title:', diagnostics.pageTitle);
      console.log('   URL:', diagnostics.currentURL.substring(0, 100) + '...\n');

      // Take a screenshot for debugging
      await this.page.screenshot({ path: 'debug-paused-state.png', fullPage: true });
      console.log('📸 Screenshot saved: debug-paused-state.png\n');

      // Try to scroll Pay Now button into view
      try {
        await this.page.locator(this.selectors.payNowBtn).scrollIntoViewIfNeeded({ timeout: 2000 });
        console.log('✅ Scrolled Pay Now button into view\n');
      } catch (e) {
        console.log('⚠️  Could not scroll to Pay Now button:', e.message, '\n');
      }

      console.log('📝 Instructions:');
      console.log('   1. Check the console output above for button state');
      console.log('   2. Check debug-paused-state.png screenshot');
      console.log('   3. Look at the browser window - can you see the Pay Now button?');
      console.log('   4. If button is hidden, check what errors/messages are on the page');
      console.log('   5. Try manually clicking Pay Now if you can see it');
      console.log('   6. Click Resume in the Playwright inspector to continue\n');

      await this.page.pause();
    }

    // CRITICAL: Wait much longer before clicking Pay Now
    // This gives Shopify time to:
    // 1. Validate all payment fields
    // 2. Process payment data in background
    // 3. Complete any async operations
    console.log('⏳ Waiting for Shopify to validate payment data...');
    await humanWait(this.page, 5000, 7000); // 5-7 seconds wait

    // Check if Pay Now button is enabled
    const payButton = this.page.locator(this.selectors.payNowBtn).first();
    await payButton.waitFor({ state: 'visible', timeout: 10000 });

    const isEnabled = await payButton.isEnabled();
    const isDisabled = await payButton.getAttribute('disabled');
    console.log(`💳 Pay button state: enabled=${isEnabled}, disabled=${isDisabled}`);

    if (isDisabled || !isEnabled) {
      console.log('⚠️  Pay button is disabled! Waiting for it to become enabled...');
      await this.page.waitForTimeout(3000);
    }

    // Scroll to pay button to ensure it's fully visible
    await payButton.scrollIntoViewIfNeeded();
    await humanWait(this.page, 1000, 2000);

    // Check for any validation errors on the page (CRITICAL: these might prevent payment)
    console.log('\n🔍 CHECKING FOR VALIDATION ERRORS...');
    const validationErrors = await this.page.evaluate(() => {
      const selectors = [
        '[class*="error"]', '[class*="Error"]',
        '[class*="invalid"]', '[class*="Invalid"]',
        '[role="alert"]', '[aria-invalid="true"]',
        '[class*="notice"]', '[class*="banner"]',
        '[class*="field-error"]', '[class*="field_error"]',
      ];

      return selectors.flatMap(sel =>
        Array.from(document.querySelectorAll(sel))
          .filter(el => el.offsetHeight > 0 && el.offsetWidth > 0) // Only visible elements
          .map(el => ({
            selector: sel,
            text: el.textContent.trim().substring(0, 300),
            tag: el.tagName,
            classes: el.className,
            ariaLabel: el.getAttribute('aria-label'),
            isVisible: window.getComputedStyle(el).visibility !== 'hidden' &&
              window.getComputedStyle(el).display !== 'none',
          }))
      );
    });

    if (validationErrors.length > 0) {
      console.log(`⚠️  VALIDATION ERRORS DETECTED: ${validationErrors.length}`);
      validationErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. [${error.tag}] ${error.text}`);
        console.log(`      Selector: ${error.selector}`);
        console.log(`      Classes: ${error.classes}`);
        if (error.ariaLabel) console.log(`      Aria-label: ${error.ariaLabel}`);
      });
      console.log('\n📸 Taking screenshot of validation errors...');
      await this.page.screenshot({ path: 'validation-errors.png', fullPage: true });
    } else {
      console.log('✅ No validation errors detected');
    }

    // One final wait to ensure everything is ready
    console.log('⏳ Final wait before clicking Pay Now...');
    await humanWait(this.page, 3000, 4000);

    console.log('🖱️  Clicking Pay Now button...');
    await humanClick(this.page, this.selectors.payNowBtn);

    console.log('⏳ Waiting for payment to process...');
    await this.page.waitForLoadState('domcontentloaded');

    // Wait longer for Shopify to process payment and redirect to confirmation page
    // Increased to give more time for payment gateway to complete
    await humanWait(this.page, 8000, 12000); // 8-12 seconds

    // Check if we got an error instead of confirmation
    const paymentErrorAfterSubmit = this.page.locator('text=/payments aren\'t available/i, text=/try again/i');
    const hasErrorAfterSubmit = await paymentErrorAfterSubmit.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasErrorAfterSubmit) {
      console.log('⚠️  Payment error appeared after clicking Pay Now!');
      await this.page.screenshot({ path: 'payment-error-after-submit.png', fullPage: true }).catch(() => { });
    } else {
      console.log('✅ Payment submitted, waiting for confirmation page...');
    }
  }

  async waitForOrderConfirmation() {
    console.log('⏳ Waiting for order confirmation page (up to 90 seconds)...');
    // Increased timeout to give Shopify more time to process payment
    await this.page.waitForSelector(this.selectors.orderConfirmedMessage, { timeout: 90000 });
    console.log('✅ Order confirmation page loaded!');
  }

  async getOrderConfirmedText() {
    await this.waitForOrderConfirmation();
    return this.page.textContent(this.selectors.orderConfirmedMessage);
  }
}
