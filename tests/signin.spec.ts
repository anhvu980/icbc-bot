import { test } from 'playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { getUserFromCSVByIndex } from '../utils/dataProcessing';

const userIndex = process.env.USER_INDEX ? parseInt(process.env.USER_INDEX) : 0;
const validUser = getUserFromCSVByIndex('valid_users.csv', userIndex);
const invalidUser = getUserFromCSVByIndex('invalid_users.csv', userIndex);

test.describe(`Tests for Sign In page`, () => {
  test('Verify user can log in with valid information', async ({ page }) => {
    const signinPage = new SignInPage(page);
    await signinPage.goto();
    await signinPage.signIn(validUser);
    await signinPage.expectSignOutVisible();
  });

  test('Verify user cannot log in with invalid information', async ({ page }) => {
    const signinPage = new SignInPage(page);
    await signinPage.goto();
    await signinPage.signIn(invalidUser);
    await signinPage.expectErrorVisible();
  });
});