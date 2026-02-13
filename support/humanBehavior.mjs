/**
 * Utility functions to make automation appear more human-like
 * This helps bypass anti-bot detection systems like CAPTCHAs
 * 
 * Set DISABLE_HUMAN_BEHAVIOR=1 to use instant actions (fallback mode)
 */

// Check if human behavior should be disabled (for fallback/debugging)
const DISABLE_HUMAN_BEHAVIOR = process.env.DISABLE_HUMAN_BEHAVIOR === '1';

/**
 * Generate a random delay between min and max milliseconds
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 * @returns {number} Random delay value
 */
export function randomDelay(min = 100, max = 500) {
  if (DISABLE_HUMAN_BEHAVIOR) return 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Wait for a random amount of time to simulate human hesitation
 * @param {Page} page - Playwright page object
 * @param {number} min - Minimum delay in ms (default: 300)
 * @param {number} max - Maximum delay in ms (default: 1500)
 */
export async function humanWait(page, min = 300, max = 1500) {
  const delay = randomDelay(min, max);
  await page.waitForTimeout(delay);
}

/**
 * Type text like a human with random delays between keystrokes
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {string} text - Text to type
 * @param {Object} options - Options for typing
 */
export async function humanType(page, selector, text, options = {}) {
  const { minDelay = 50, maxDelay = 150, clearFirst = true } = options;
  
  // If disabled, use instant fill (fallback to old behavior)
  if (DISABLE_HUMAN_BEHAVIOR) {
    await page.fill(selector, text);
    return;
  }
  
  // Wait a bit before starting to type
  await humanWait(page, 200, 500);
  
  // Clear the field first if needed
  if (clearFirst) {
    await page.click(selector);
    await page.fill(selector, '');
  }
  
  // Type each character with random delays
  for (let i = 0; i < text.length; i++) {
    await page.type(selector, text[i], { delay: randomDelay(minDelay, maxDelay) });
    
    // Occasionally pause longer (simulating thinking)
    if (Math.random() < 0.1) { // 10% chance
      await page.waitForTimeout(randomDelay(200, 500));
    }
  }
  
  // Small pause after typing
  await humanWait(page, 100, 300);
}

/**
 * Click an element with human-like behavior (move mouse first, then click)
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 */
export async function humanClick(page, selector) {
  // If disabled, use instant click (fallback to old behavior)
  if (DISABLE_HUMAN_BEHAVIOR) {
    await page.click(selector);
    return;
  }
  
  // Wait before clicking (simulating looking at the element)
  await humanWait(page, 200, 600);
  
  // Hover before clicking
  await page.hover(selector);
  await page.waitForTimeout(randomDelay(100, 300));
  
  // Click
  await page.click(selector);
  
  // Small pause after clicking
  await humanWait(page, 100, 400);
}

/**
 * Scroll the page randomly to simulate human browsing
 * @param {Page} page - Playwright page object
 */
export async function randomScroll(page) {
  const scrollAmount = randomDelay(100, 400);
  await page.evaluate((amount) => {
    window.scrollBy(0, amount);
  }, scrollAmount);
  await humanWait(page, 200, 500);
}

/**
 * Move mouse to random positions occasionally
 * @param {Page} page - Playwright page object
 */
export async function randomMouseMovement(page) {
  if (Math.random() < 0.3) { // 30% chance
    const viewport = page.viewportSize();
    const x = Math.floor(Math.random() * viewport.width);
    const y = Math.floor(Math.random() * viewport.height);
    await page.mouse.move(x, y, { steps: randomDelay(5, 15) });
  }
}

/**
 * Simulate human-like form filling with random pauses
 * @param {Page} page - Playwright page object
 * @param {Array} fields - Array of {selector, value} objects
 */
export async function fillFormHumanLike(page, fields) {
  for (const field of fields) {
    // Random mouse movement occasionally
    await randomMouseMovement(page);
    
    // Scroll to the field
    await page.locator(field.selector).scrollIntoViewIfNeeded();
    await humanWait(page, 150, 400);
    
    // Type the value
    await humanType(page, field.selector, field.value);
    
    // Sometimes scroll a bit after filling
    if (Math.random() < 0.2) {
      await randomScroll(page);
    }
  }
}
