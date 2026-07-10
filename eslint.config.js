import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    ignores: ['allure-report/**/*', 'allure-results/**/*', 'test-results/**/*', 'playwright-report/**/*'],
  },
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'warn',
      'playwright/no-skipped-test': 'off',
    },
  }
);
