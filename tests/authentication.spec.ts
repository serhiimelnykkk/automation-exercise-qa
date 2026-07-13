import { test, expect } from '@/fixtures/authentication';
import { Locator } from '@playwright/test';
import testData from "@/data/test-data.json" with { type: 'json' };
import { UserDetails } from '@/pages/SignupPage';
import { UserApiClient } from '@/api/UserApiClient';

test.describe('Authentication UI Tests', () => {
  test('TC-AUTH-1: User signs up successfully with all fields', async ({ loginPage, signupPage, accountCreatedPage, page }) => {
    const uniqueEmail = `test_full_${Date.now()}@example.com`;

    await loginPage.navigateToLogin();
    await expect(loginPage.signupHeading).toBeVisible();

    await loginPage.fillSignupForm(testData.validFullUser.name, uniqueEmail);
    await loginPage.clickSignup();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(signupPage.heading).toBeVisible();

    const fullUser: UserDetails = {
      ...testData.validFullUser,
      title: testData.validFullUser.title as 'Mr.' | 'Mrs.',
      email: uniqueEmail
    };

    await signupPage.fillAccountDetails(fullUser);
    await signupPage.fillAddressDetails(fullUser);
    await signupPage.clickCreateAccount();

    await expect(page).toHaveURL(/\/account_created$/);
    await expect(accountCreatedPage.heading).toBeVisible();

    await accountCreatedPage.clickContinue();
    await expect(page).toHaveURL(/\/$/);

    await expect(loginPage.loggedInAsText).toContainText(`Logged in as ${testData.validFullUser.name}`);
  });

  test('TC-AUTH-2: User signs up successfully with only required fields', async ({ loginPage, signupPage, accountCreatedPage, page }) => {
    const uniqueEmail = `test_req_${Date.now()}@example.com`;

    await loginPage.navigateToLogin();
    await expect(loginPage.signupHeading).toBeVisible();

    await loginPage.fillSignupForm(testData.validRequiredUser.name, uniqueEmail);
    await loginPage.clickSignup();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(signupPage.heading).toBeVisible();

    const reqUser = {
      ...testData.validRequiredUser,
      name: testData.validRequiredUser.name,
      email: uniqueEmail
    };

    await signupPage.fillAccountDetails(reqUser);
    await signupPage.fillAddressDetails(reqUser);
    await signupPage.clickCreateAccount();

    await expect(page).toHaveURL(/\/account_created$/);
    await expect(accountCreatedPage.heading).toBeVisible();

    await accountCreatedPage.clickContinue();
    await expect(page).toHaveURL(/\/$/);

    await expect(loginPage.loggedInAsText).toContainText(`Logged in as ${testData.validRequiredUser.name}`);
  });

  test('TC-AUTH-3: Leaving all fields empty on step 1 doesn’t sign up a user', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();
    await expect(loginPage.signupHeading).toBeVisible();

    await loginPage.fillSignupForm('', '');
    await loginPage.clickSignup();

    await expect(loginPage.signupNameInput).toHaveJSProperty('validity.valid', false);
    await expect(loginPage.signupEmailInput).toHaveJSProperty('validity.valid', false);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC-AUTH-4: Leaving all fields empty on step 2 doesn’t sign up a user', async ({ loginPage, signupPage, page }) => {
    const uniqueEmail = `test_empty_${Date.now()}@example.com`;

    await loginPage.navigateToLogin();
    await loginPage.fillSignupForm(testData.validRequiredUser.name, uniqueEmail);
    await loginPage.clickSignup();

    await expect(page).toHaveURL(/\/signup$/);
    await expect(signupPage.heading).toBeVisible();

    await signupPage.clickCreateAccount();

    await expect(signupPage.passwordInput).toHaveJSProperty('validity.valid', false);
    await expect(page).toHaveURL(/\/signup$/);
  });

  test('TC-AUTH-5: Leaving email field empty on step 1 doesn’t signup a user', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillSignupForm(testData.validRequiredUser.name, '');
    await loginPage.clickSignup();

    await expect(loginPage.signupEmailInput).toHaveJSProperty('validity.valid', false);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC-AUTH-6: Leaving name field empty on step 1 doesn’t signup a user', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();
    await loginPage.fillSignupForm('', `test_${Date.now()}@example.com`);
    await loginPage.clickSignup();

    await expect(loginPage.signupNameInput).toHaveJSProperty('validity.valid', false);
    await expect(page).toHaveURL(/\/login$/);
  });

  const step2RequiredFields = [
    { id: 'TC-AUTH-7', field: 'password', desc: 'Password' },
    { id: 'TC-AUTH-8', field: 'firstName', desc: 'First name' },
    { id: 'TC-AUTH-9', field: 'state', desc: 'State' },
    { id: 'TC-AUTH-10', field: 'zipcode', desc: 'Zipcode' },
    { id: 'TC-AUTH-11', field: 'lastName', desc: 'Last name' },
    { id: 'TC-AUTH-12', field: 'mobileNumber', desc: 'Mobile Number' },
    { id: 'TC-AUTH-14', field: 'city', desc: 'City' },
    { id: 'TC-AUTH-15', field: 'address1', desc: 'Address' }
  ];

  for (const { id, field, desc } of step2RequiredFields) {
    test(`${id}: Leaving ${desc} field empty on step 2 doesn’t sign up a user`, async ({ loginPage, signupPage, page }) => {
      const uniqueEmail = `test_missing_${field}_${Date.now()}@example.com`;

      await loginPage.navigateToLogin();
      await loginPage.fillSignupForm(testData.validRequiredUser.name, uniqueEmail);
      await loginPage.clickSignup();

      await expect(page).toHaveURL(/\/signup$/);

      const user = {
        ...testData.validRequiredUser,
        name: testData.validRequiredUser.name,
        email: uniqueEmail
      };

      await signupPage.fillAccountDetails(user);
      await signupPage.fillAddressDetails(user);

      const locator = signupPage[`${field}Input` as keyof typeof signupPage] as Locator;

      await locator.fill('');
      await signupPage.clickCreateAccount();

      await expect(locator).toHaveJSProperty('validity.valid', false);
      await expect(page).toHaveURL(/\/signup$/);
    });
  }

  test('TC-AUTH-13: Leaving Country field empty on step 2 doesn’t sign up a user', async ({ loginPage, signupPage, page }) => {
    const uniqueEmail = `test_country_${Date.now()}@example.com`;

    await loginPage.navigateToLogin();
    await loginPage.fillSignupForm(testData.validRequiredUser.name, uniqueEmail);
    await loginPage.clickSignup();

    await expect(page).toHaveURL(/\/signup$/);

    await expect(await signupPage.countrySelect).not.toHaveValue('');
    await expect(signupPage.countrySelect).toHaveJSProperty('validity.valid', true);
  });

  test('TC-AUTH-16: Email validates format on signup form', async ({ loginPage, page }) => {
    await loginPage.navigateToLogin();

    for (const email of testData.invalidEmails) {
      await loginPage.fillSignupForm(testData.validRequiredUser.name, email);
      await loginPage.clickSignup();

      await expect(loginPage.signupEmailInput).toHaveJSProperty('validity.valid', false);
      await expect(page).toHaveURL(/\/login$/);
    }
  });

  test.describe('Login & Login Validations', () => {
    test.beforeAll(async ({ request }) => {
      const userApiClient = new UserApiClient(request);
      await userApiClient.createUser(testData.loginCredentials);
    });

    test.afterAll(async ({ request }) => {
      const userApiClient = new UserApiClient(request);
      await userApiClient.deleteUser({
        email: testData.loginCredentials.email,
        password: testData.loginCredentials.password
      });
    });

    test('TC-AUTH-17: User logs in with correct credentials', async ({ loginPage, page }) => {
      await loginPage.navigateToLogin();
      await expect(loginPage.loginHeading).toBeVisible();

      await loginPage.fillLoginForm(testData.loginCredentials.email, testData.loginCredentials.password);
      await loginPage.clickLogin();

      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.loggedInAsText).toContainText(`Logged in as ${testData.loginCredentials.name}`);
    });

    test('TC-AUTH-18: Leaving all fields empty on login form doesn’t log in a user', async ({ loginPage, page }) => {
      await loginPage.navigateToLogin();
      await expect(loginPage.loginHeading).toBeVisible();

      await loginPage.fillLoginForm('', '');
      await loginPage.clickLogin();

      await expect(loginPage.loginEmailInput).toHaveJSProperty('validity.valid', false);
      await expect(loginPage.loginPasswordInput).toHaveJSProperty('validity.valid', false);
      await expect(page).toHaveURL(/\/login$/);
    });

    test('TC-AUTH-19: Leaving password field empty on login form doesn’t log in a user', async ({ loginPage, page }) => {
      await loginPage.navigateToLogin();
      await expect(loginPage.loginHeading).toBeVisible();

      await loginPage.fillLoginForm(testData.loginCredentials.email, '');
      await loginPage.clickLogin();

      await expect(loginPage.loginPasswordInput).toHaveJSProperty('validity.valid', false);
      await expect(page).toHaveURL(/\/login$/);
    });

    test('TC-AUTH-20: Leaving email field empty on login form doesn’t log in a user', async ({ loginPage, page }) => {
      await loginPage.navigateToLogin();
      await expect(loginPage.loginHeading).toBeVisible();

      await loginPage.fillLoginForm('', testData.loginCredentials.password);
      await loginPage.clickLogin();

      await expect(loginPage.loginEmailInput).toHaveJSProperty('validity.valid', false);
      await expect(page).toHaveURL(/\/login$/);
    });

    test('TC-AUTH-21: Email validates format on login form', async ({ loginPage, page }) => {
      await loginPage.navigateToLogin();
      await expect(loginPage.loginHeading).toBeVisible();

      for (const email of testData.invalidEmails) {
        await loginPage.fillLoginForm(email, testData.loginCredentials.password);
        await loginPage.clickLogin();

        await expect(loginPage.loginEmailInput).toHaveJSProperty('validity.valid', false);
        await expect(page).toHaveURL(/\/login$/);
      }
    });
  });
});
