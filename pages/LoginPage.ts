import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly loginHeading: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorText: Locator;

  readonly signupHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorText: Locator;

  constructor(page: Page) {
    super(page);
    this.loginHeading = page.locator('.login-form h2');
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginErrorText = page.locator('.login-form p');

    this.signupHeading = page.locator('.signup-form h2');
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.signupErrorText = page.locator('.signup-form p');
  }

  async fillLoginForm(email?: string, password?: string): Promise<void> {
    await this.fillInput(this.loginEmailInput, email);
    await this.fillInput(this.loginPasswordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async fillSignupForm(name?: string, email?: string): Promise<void> {
    await this.fillInput(this.signupNameInput, name);
    await this.fillInput(this.signupEmailInput, email);
  }

  async clickSignup(): Promise<void> {
    await this.signupButton.click();
  }

  async isFieldInvalid(field: 'loginEmail' | 'loginPassword' | 'signupName' | 'signupEmail'): Promise<boolean> {
    const fieldMap: Record<typeof field, Locator> = {
      loginEmail: this.loginEmailInput,
      loginPassword: this.loginPasswordInput,
      signupName: this.signupNameInput,
      signupEmail: this.signupEmailInput,
    };
    return this.checkFieldValidity(fieldMap[field]);
  }
}
