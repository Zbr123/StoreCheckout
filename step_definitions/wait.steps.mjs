import { When } from '@cucumber/cucumber';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

When('I wait {int} seconds', async function (seconds) {
  await delay(seconds * 1000);
});

When('I wait {string} seconds', async function (secondsStr) {
  const seconds = parseInt(secondsStr, 10) || 0;
  await delay(seconds * 1000);
});
