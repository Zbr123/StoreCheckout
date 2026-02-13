import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage.mjs';

Given('I am on the Playwright homepage', async function () {
  this.homePage = new PlaywrightHomePage(this.page);
  await this.homePage.open();
});

When('I click {string}', async function (buttonText) {
  if (buttonText === 'Get Started') {
    await this.homePage.clickGetStarted();
  }
});

Then('I should be on the documentation page', async function () {
  const isOnDocs = await this.homePage.isOnDocsPage();
  expect(isOnDocs).toBeTruthy();
});

Then('the page title should contain {string}', async function (expectedText) {
  await this.page.waitForSelector('.theme-doc-markdown header h1', { timeout: 15000 });
  await this.page.waitForFunction(
    (t) => document.title.includes(t),
    expectedText,
    { timeout: 15000 }
  );
  const title = await this.homePage.getTitle();
  expect(title).toContain(expectedText);
});
