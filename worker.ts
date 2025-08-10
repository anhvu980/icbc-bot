import { workerData, parentPort } from 'worker_threads';
import { chromium } from 'playwright';

type User = {
  lastName: string;
  licenceNumber: string;
  keyword: string;
};

async function loginAndBook(page: any, user: User) {
  try {
    await page.goto('https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver');
    await page.fill('input[formcontrolname="drvrLastName"]', user.lastName);
    await page.fill('input[formcontrolname="licenceNumber"]', user.licenceNumber);
    await page.fill('input[formcontrolname="keyword"]', user.keyword);
    await page.click('label.mat-checkbox-layout');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // TODO: Add booking logic here

    parentPort?.postMessage(`User ${user.lastName} logged in and booked successfully.`);
  } catch (error: any) {
    parentPort?.postMessage(`User ${user.lastName} failed: ${error.message}`);
  }
}

async function run(users: User[]) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const user of users) {
    await loginAndBook(page, user);
  }

  await browser.close();
  parentPort?.postMessage('Worker done');
}

run(workerData).catch((err) => {
  parentPort?.postMessage(`Worker error: ${err.message}`);
});
