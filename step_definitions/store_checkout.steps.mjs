import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PasswordPage } from '../pages/store/PasswordPage.mjs';
import { DashboardPage } from '../pages/store/DashboardPage.mjs';
import { ProductPage } from '../pages/store/ProductPage.mjs';
import { CartPage } from '../pages/store/CartPage.mjs';
import { CheckoutPage } from '../pages/store/CheckoutPage.mjs';

Given('I am on the store password page', async function () {
  this.passwordPage = new PasswordPage(this.page);
  await this.passwordPage.openPasswordPage();
});

When('I click enter using password', async function () {
  await this.passwordPage.clickEnterUsingPassword();
});

When('I enter password {string} and submit', async function (password) {
  await this.passwordPage.enterPasswordAndSubmit(password);
});

When('I click the first product on the dashboard', async function () {
  this.dashboardPage = new DashboardPage(this.page);
  await this.dashboardPage.clickFirstProduct();
  this.productPage = new ProductPage(this.page);
});

When('I select size variant {string}', async function (size) {
  if (!this.productPage) this.productPage = new ProductPage(this.page);
  await this.productPage.selectSizeVariant(size);
});

When('I select quantity {string}', async function (quantity) {
  if (!this.productPage) this.productPage = new ProductPage(this.page);
  await this.productPage.selectQuantity(quantity);
});

When('I click add to cart', async function () {
  if (!this.productPage) this.productPage = new ProductPage(this.page);
  await this.productPage.clickAddToCart();
});

When('I click checkout', async function () {
  this.cartPage = new CartPage(this.page);
  await this.cartPage.clickCheckout();
});

When('I enter email {string}', async function (email) {
  this.checkoutPage = new CheckoutPage(this.page);
  await this.checkoutPage.enterEmail(email);
});

When('I select delivery option {string}', async function (option) {
  await this.checkoutPage.selectShipOrPickup(option);
});

When('I enter first name {string}', async function (firstName) {
  await this.checkoutPage.enterFirstName(firstName);
});

When('I enter last name {string}', async function (lastName) {
  await this.checkoutPage.enterLastName(lastName);
});

When('I enter address {string}', async function (address) {
  await this.checkoutPage.enterAddress(address);
});

When('I enter apartment {string}', async function (apartment) {
  await this.checkoutPage.enterApartment(apartment);
});

When('I enter city {string}', async function (city) {
  await this.checkoutPage.enterCity(city);
});

When('I select state {string}', async function (state) {
  await this.checkoutPage.selectState(state);
});

When('I enter zip code {string}', async function (zip) {
  await this.checkoutPage.enterZipCode(zip);
});

When('I enter gift or discount code {string}', async function (giftCode) {
  await this.checkoutPage.enterDiscountCodeOrGiftCard(giftCode);
});

When('I enter phone number {string}', async function (phone) {
  await this.checkoutPage.enterPhoneNumber(phone);
});

When('I select shipping method {string}', async function (method) {
  await this.checkoutPage.selectShippingMethod(method);
});

When('I provide payment information', async function (dataTable) {
  const data = dataTable.hashes()[0];
  await this.checkoutPage.enterPaymentInfo({
    cardNumber: data.cardNumber,
    cardName: data.cardName,
    expiryDate: data.expiryDate,
    cvv: data.cvv,
  });
});

When('I click the {string} button', async function (buttonText) {
  await this.checkoutPage.clickButtonByText(buttonText);
});

When('I click pay now', async function () {
  await this.checkoutPage.clickPayNow();
});

Then('I should see the order confirmed message', async function () {
  const text = await this.checkoutPage.getOrderConfirmedText();
  expect(text).toMatch(/order is confirmed|confirmed|thank you/i);
});
