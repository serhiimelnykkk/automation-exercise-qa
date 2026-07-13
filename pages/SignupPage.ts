import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface UserDetails {
  title?: 'Mr.' | 'Mrs.';
  name: string;
  email: string;
  password?: string;
  dob?: {
    day: string;
    month: string;
    year: string;
  };
  newsletter?: boolean;
  offers?: boolean;
  firstName?: string;
  lastName?: string;
  company?: string;
  address?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  mobileNumber?: string;
}

export class SignupPage extends BasePage {
  readonly heading: Locator;
  readonly genderMrRadio: Locator;
  readonly genderMrsRadio: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly optinCheckbox: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('.login-form h2').first();
    this.genderMrRadio = page.locator('#id_gender1');
    this.genderMrsRadio = page.locator('#id_gender2');
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');

    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
  }

  async fillAccountDetails(details: UserDetails): Promise<void> {
    if (details.title === 'Mr.') {
      await this.genderMrRadio.check();
    } else if (details.title === 'Mrs.') {
      await this.genderMrsRadio.check();
    }

    await this.fillInput(this.passwordInput, details.password);

    if (details.dob) {
      await this.selectOptionIfProvided(this.daysSelect, details.dob.day);
      await this.selectOptionIfProvided(this.monthsSelect, details.dob.month);
      await this.selectOptionIfProvided(this.yearsSelect, details.dob.year);
    }

    await this.checkCheckboxIfTrue(this.newsletterCheckbox, details.newsletter);
    await this.checkCheckboxIfTrue(this.optinCheckbox, details.offers);
  }

  async fillAddressDetails(details: UserDetails): Promise<void> {
    await this.fillInput(this.firstNameInput, details.firstName);
    await this.fillInput(this.lastNameInput, details.lastName);
    await this.fillInputIfProvided(this.companyInput, details.company);
    await this.fillInput(this.address1Input, details.address);
    await this.fillInputIfProvided(this.address2Input, details.address2);
    await this.selectOptionIfProvided(this.countrySelect, details.country);
    await this.fillInput(this.stateInput, details.state);
    await this.fillInput(this.cityInput, details.city);
    await this.fillInput(this.zipcodeInput, details.zipcode);
    await this.fillInput(this.mobileNumberInput, details.mobileNumber);
  }

  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }

  async isFieldInvalid(fieldName: string): Promise<boolean> {
    const fieldMap: Record<string, Locator> = {
      password: this.passwordInput,
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      address: this.address1Input,
      country: this.countrySelect,
      state: this.stateInput,
      city: this.cityInput,
      zipcode: this.zipcodeInput,
      mobileNumber: this.mobileNumberInput,
    };

    const locator = fieldMap[fieldName];
    if (!locator) {
      throw new Error(`Unknown field name: ${fieldName}`);
    }
    return this.checkFieldValidity(locator);
  }
}
