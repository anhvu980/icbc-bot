import { Page, expect } from '@playwright/test';
import { User } from '../types/user';

export class SignInPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/webdeas-ui/login;type=driver');
  }

  async signIn(user: User) {
    await this.page.fill('[formcontrolname="drvrLastName"]', user.lastName);
    await this.page.fill('[formcontrolname="licenceNumber"]', user.licenceNumber);
    await this.page.fill('[formcontrolname="keyword"]', user.keyword);

    // Click label for checkbox to avoid pointer event issues
    await this.page.click('label[for="mat-checkbox-1-input"]');

    await this.page.click('button:has-text("Sign in")');
  }

  async expectSignOutVisible() {
    await expect(this.page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  }

  async expectErrorVisible() {
    await expect(this.page.getByText('One or more of your entries is incorrect. Verify that your last name, BC driver’s licence number, and keyword are correct.')).toBeVisible();
  }
}
