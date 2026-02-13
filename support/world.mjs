import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium } from 'playwright';

class PlaywrightWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.baseURL = process.env.BASE_URL || 'https://playwright.dev';
  }

  async init() {
    // Launch browser with playwright-extra stealth plugin
    // The stealth plugin automatically handles 30+ detection techniques
    this.browser = await chromium.launch({
      headless: process.env.HEADED !== '1',
      args: [
        '--window-size=1920,1080', // Set outer window size (CRITICAL: must be larger than viewport)
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // REMOVED: --disable-web-security (breaks payment iframes and PCI compliance)
        // REMOVED: --disable-features=IsolateOrigins,site-per-process (breaks iframe isolation)
        // REMOVED: --allow-running-insecure-content (breaks PCI compliance)
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        // REMOVED: --incognito (doesn't work properly with Playwright contexts)
        // REMOVED: --disable-extensions (not needed)
        // REMOVED: --disable-plugins (contradicts plugins spoofing)
        // REMOVED: --disable-sync (not needed)
        '--no-first-run',
        '--no-default-browser-check',
      ],
      // Slow down operations slightly to appear more human
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 50,
    });

    // Create context with realistic settings (incognito mode)
    this.context = await this.browser.newContext({
      // CRITICAL: viewport (inner) must be SMALLER than window size (outer 1920x1080)
      // This mimics real browser chrome (toolbar, address bar, etc.)
      viewport: { width: 1366, height: 768 }, // Common laptop resolution, smaller than outer window
      deviceScaleFactor: 1, // Exact integer, not floating point
      baseURL: this.baseURL,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York',
      permissions: ['geolocation', 'notifications'],
      geolocation: { longitude: -74.006, latitude: 40.7128 },
      javaScriptEnabled: true,
      screen: { width: 1920, height: 1080 },
      colorScheme: 'light',
      // Clear all cookies and storage for fresh incognito session
      storageState: undefined,
      acceptDownloads: true,
      // REMOVED: extraHTTPHeaders entirely
      // The browser sets Sec-Fetch-* headers correctly per request type automatically.
      // Overriding them globally makes every API call look fake to Shopify:
      // - Navigation → Sec-Fetch-Mode: navigate, Sec-Fetch-Dest: document
      // - API/XHR → Sec-Fetch-Mode: cors, Sec-Fetch-Dest: empty
      // - Iframe → Sec-Fetch-Mode: navigate, Sec-Fetch-Dest: iframe
      // Setting navigate+document globally breaks /sessions POST requests!
    });

    // Create page
    this.page = await this.context.newPage();
    
    // CRITICAL: Monitor /sessions endpoint (this is where payment fails)
    this.page.on('request', request => {
      if (request.url().includes('pci.shopifyinc.com/sessions')) {
        console.log('\n🔐 SESSIONS REQUEST (Payment Processing):');
        console.log('   URL:', request.url());
        console.log('   Method:', request.method());
        console.log('   Headers:', JSON.stringify(request.headers(), null, 2));
        const postData = request.postData();
        if (postData) {
          console.log('   Body:', postData.substring(0, 500));
        }
      }
    });
    
    // Monitor payment-related network requests (Stripe, Shopify, payment gateways)
    this.page.on('response', async (response) => {
      const url = response.url();
      
      // Special handling for /sessions endpoint (critical for payment)
      if (url.includes('pci.shopifyinc.com/sessions')) {
        const status = response.status();
        console.log(`\n💳 SESSIONS RESPONSE: ${status}`);
        try {
          const body = await response.text();
          console.log(`   📄 Response Body: ${body.substring(0, 800)}`);
        } catch (e) {
          console.log(`   ⚠️  Could not read response body: ${e.message}`);
        }
      }
      
      // Monitor Stripe, Shopify payment, and checkout API calls
      if (url.includes('stripe.com') || 
          url.includes('shopifyinc.com') || 
          url.includes('/checkouts/') || 
          url.includes('/payments/') ||
          url.includes('payment') ||
          url.includes('checkout.pci')) {
        const status = response.status();
        console.log(`🌐 Payment API: ${url.substring(0, 100)} → Status: ${status}`);
        
        // Log errors
        if (status >= 400) {
          console.log(`   ❌ ERROR ${status}: ${response.statusText()}`);
          try {
            const body = await response.text();
            if (body && body.length < 500) {
              console.log(`   📄 Response: ${body}`);
            }
          } catch (e) {
            // Can't read body, skip
          }
        }
      }
    });
    
    // Monitor request failures
    this.page.on('requestfailed', (request) => {
      const url = request.url();
      if (url.includes('stripe') || url.includes('payment') || url.includes('checkout')) {
        console.log(`❌ Request Failed: ${url.substring(0, 100)}`);
        console.log(`   Failure: ${request.failure()?.errorText}`);
      }
    });
    
    // Apply manual stealth techniques (proven to work better than plugin for this case)
    await this.page.addInitScript(() => {
      // Override the navigator.webdriver property to false (Stripe specifically checks for false)
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      // Override the navigator.plugins to have realistic values
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Override navigator.languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Mock chrome object
      window.chrome = {
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {}
      };

      // Mock permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
      
      // Override navigator properties to look more real
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8,
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8,
      });
      
      // Fix devicePixelRatio to be exact integer (not floating point)
      // CRITICAL: Shopify detects the floating point artifact
      Object.defineProperty(window, 'devicePixelRatio', {
        get: () => 1,
      });
    });
    
    console.log('✅ Manual stealth enabled (proven to bypass CAPTCHA)');
    console.log('🕵️  Fresh session with no cookies/storage (storageState: undefined)');
    
    // Verify stealth is working
    const stealthCheck = await this.page.evaluate(() => {
      return {
        webdriver: navigator.webdriver,
        plugins: navigator.plugins.length,
        chrome: typeof window.chrome !== 'undefined',
        hardwareConcurrency: navigator.hardwareConcurrency
      };
    });
    
    console.log('🔍 Stealth check:', stealthCheck);
    console.log(`   navigator.webdriver = ${stealthCheck.webdriver} (should be false)`);
    console.log(stealthCheck.webdriver === false ? '✅ webdriver is FALSE (correct for Stripe)' : '❌ webdriver NOT false (Stripe may reject)');
    
    // Verify window size fix (CRITICAL for Shopify detection)
    const windowSizeCheck = await this.page.evaluate(() => {
      return {
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      };
    });
    
    console.log('🖥️  Window Size Check (CRITICAL):');
    console.log(`   Outer: ${windowSizeCheck.outerWidth}x${windowSizeCheck.outerHeight}`);
    console.log(`   Inner: ${windowSizeCheck.innerWidth}x${windowSizeCheck.innerHeight}`);
    console.log(`   Screen: ${windowSizeCheck.screenWidth}x${windowSizeCheck.screenHeight}`);
    console.log(`   Pixel Ratio: ${windowSizeCheck.devicePixelRatio} (should be exact integer)`);
    
    // Check if inner is smaller than outer (must be true in real browsers)
    const sizeValid = windowSizeCheck.innerWidth < windowSizeCheck.outerWidth && 
                     windowSizeCheck.innerHeight < windowSizeCheck.outerHeight;
    console.log(sizeValid ? 
      '   ✅ Inner < Outer (correct)' : 
      '   ❌ Inner >= Outer (automation fingerprint!)');
    
    // Verify incognito mode by checking storage state
    const incognitoCheck = await this.page.evaluate(() => {
      try {
        return {
          localStorageSize: localStorage.length,
          sessionStorageSize: sessionStorage.length,
          cookiesEnabled: navigator.cookieEnabled
        };
      } catch (e) {
        return { error: e.message };
      }
    });
    
    console.log('🕵️  Incognito check (storage should be empty on first run):', incognitoCheck);
  }

  async destroy() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  getPage() {
    return this.page;
  }
}

setWorldConstructor(PlaywrightWorld);
