import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;
  
  readonly homeLink: Locator;
  readonly signupLoginLink: Locator;
  readonly loggedInAsText: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.locator('header a[href="/"]');
    this.signupLoginLink = page.locator('header a[href="/login"]');
    this.loggedInAsText = page.locator('header li:has-text("Logged in as")');
    this.logoutLink = page.locator('header a[href="/logout"]');
    this.deleteAccountLink = page.locator('header a[href="/delete_account"]');
  }

  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async clickSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async clickDeleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }

  async isLoggedInAs(username: string): Promise<boolean> {
    const text = `Logged in as ${username}`;
    return this.page.locator(`header li:has-text("${text}")`).isVisible();
  }

  protected async fillInput(locator: Locator, value?: string): Promise<void> {
    if (value !== undefined) {
      await locator.fill(value);
    } else {
      await locator.clear();
    }
  }

  protected async fillInputIfProvided(locator: Locator, value?: string): Promise<void> {
    if (value !== undefined) {
      await locator.fill(value);
    }
  }

  protected async selectOptionIfProvided(locator: Locator, value?: string): Promise<void> {
    if (value !== undefined) {
      await locator.selectOption(value);
    }
  }

  protected async checkCheckboxIfTrue(locator: Locator, value?: boolean): Promise<void> {
    if (value) {
      await locator.check();
    }
  }

  protected async checkFieldValidity(locator: Locator): Promise<boolean> {
    return locator.evaluate((el: HTMLInputElement) => !el.validity.valid);
  }
}
