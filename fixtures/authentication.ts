import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { AccountCreatedPage } from '@/pages/AccountCreatedPage';
import { AccountDeletedPage } from '@/pages/AccountDeletedPage';
import { UserApiClient } from '@/api/UserApiClient';

interface TestFixtures {
  loginPage: LoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
  accountDeletedPage: AccountDeletedPage;
  userApiClient: UserApiClient;
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },
  accountCreatedPage: async ({ page }, use) => {
    const accountCreatedPage = new AccountCreatedPage(page);
    await use(accountCreatedPage);
  },
  accountDeletedPage: async ({ page }, use) => {
    const accountDeletedPage = new AccountDeletedPage(page);
    await use(accountDeletedPage);
  },
  userApiClient: async ({ request }, use) => {
    const userApiClient = new UserApiClient(request);
    await use(userApiClient);
  },
});

export { expect } from '@playwright/test';
