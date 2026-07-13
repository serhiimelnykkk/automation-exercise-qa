import { APIRequestContext } from '@playwright/test';

export interface CreateUserParams {
  name: string;
  email: string;
  password?: string;
  title?: string;
  birth_date?: string;
  birth_month?: string;
  birth_year?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  mobile_number?: string;
  [key: string]: string | undefined;
}

export interface DeleteUserParams {
  email: string;
  password?: string;
  [key: string]: string | undefined;
}

export class UserApiClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private toFormFields(data: Record<string, string | undefined>): Record<string, string> {
    const formParams: Record<string, string> = {};
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (val !== undefined) {
        formParams[key] = val;
      }
    }
    return formParams;
  }

  async createUser(data: CreateUserParams): Promise<void> {
    await this.request.post('/api/createAccount', {
      form: this.toFormFields(data),
    });
  }

  async deleteUser(data: DeleteUserParams): Promise<void> {
    await this.request.delete('/api/deleteAccount', {
      form: this.toFormFields(data),
    });
  }
}
