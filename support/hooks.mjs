import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(120 * 1000); // Increased to 120 seconds to accommodate longer payment processing

Before(async function () {
  await this.init();
});

After(async function () {
  await this.destroy();
});
