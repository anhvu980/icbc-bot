import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: 4,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    headless: isCI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://onlinebusiness.icbc.com',
  },
});
