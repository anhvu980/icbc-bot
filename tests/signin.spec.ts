import { test } from 'playwright/test';
import { SignInPage } from '../pages/SignInPage';
import { getUserFromCSVByIndex } from '../utils/dataProcessing';

const userIndex = process.env.USER_INDEX ? parseInt(process.env.USER_INDEX) : 0;
const user = getUserFromCSVByIndex('users.csv', userIndex);

test.describe(`Tests for user: ${user.lastName}`, () => {
  test('Verify user can log in with valid information', async ({ page }) => {
    const signinPage = new SignInPage(page);
    await signinPage.goto();
    await signinPage.signIn(user);
    await signinPage.expectSignOutVisible();
  });

  test('Verify user cannot log in with invalid information', async ({ page }) => {
    const signinPage = new SignInPage(page);
    await signinPage.goto();
    await signinPage.signIn({
      ...user,
      licenceNumber: '1234566',
      keyword: 'wrong'
    });
    await signinPage.expectErrorVisible();
  });
});