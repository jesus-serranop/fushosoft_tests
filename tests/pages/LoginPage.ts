import { Page, expect } from '@playwright/test';

/**
 * Page Object for the Fushosoft login flow.
 *
 * The app uses Auth0 Universal Login:
 *   1. /login  — app page with "Iniciar sesión" button
 *   2. Auth0 domain — email + password form (on auth0.com)
 *   3. Redirects back to /summary on success
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  // ── App login page ──────────────────────────────────────────────────────────

  /** Navigate to the app's login page. */
  async goto() {
    await this.page.goto('/login');
  }

  /** Click the "Iniciar sesión" button to be redirected to Auth0. */
  async clickIniciarSesion() {
    await this.page.getByRole('button', { name: /iniciar sesión/i }).click();
  }

  // ── Auth0 Universal Login form ──────────────────────────────────────────────

  /** Fill in the email field on the Auth0 login form. */
  async fillEmail(email: string) {
    await this.page.getByLabel(/email/i).fill(email);
  }

  /** Fill in the password field on the Auth0 login form. */
  async fillPassword(password: string) {
    await this.page.getByLabel(/password/i).fill(password);
  }

  /** Click the continue / submit button on the Auth0 form. */
  async submitAuth0Form() {
    // Auth0 standard flow uses a "Continue" button
    await this.page.getByRole('button', { name: /continue/i }).click();
  }

  // ── Convenience ────────────────────────────────────────────────────────────

  /**
   * Full happy-path login: navigate to /login, click the app button,
   * fill credentials on Auth0, submit, and wait for the dashboard redirect.
   */
  async loginAs(email: string, password: string) {
    await this.goto();
    await this.clickIniciarSesion();

    // Wait for Auth0 domain to load
    await this.page.waitForURL(/auth0\.com/);

    await this.fillEmail(email);
    await this.submitAuth0Form(); // Auth0 email-first step
    await this.fillPassword(password);
    await this.submitAuth0Form(); // Password step

    // Wait for the successful redirect back to the app dashboard
    await this.page.waitForURL(/admin\.fushosoft\.com\.mx\/summary/, {
      timeout: 15_000,
    });
  }

  // ── Assertions ──────────────────────────────────────────────────────────────

  /** Assert the app's login page is visible with the "Iniciar sesión" button. */
  async expectLoginPageVisible() {
    await expect(
      this.page.getByRole('button', { name: /iniciar sesión/i }),
    ).toBeVisible();
  }

  /** Assert the user landed on the summary dashboard after login. */
  async expectDashboardVisible() {
    await expect(this.page).toHaveURL(/\/summary/);
  }

  /** Assert an Auth0 error message is shown (e.g. wrong password). */
  async expectAuth0ErrorVisible() {
    // Auth0 surfaces errors in an element with role="alert" or a visible error div
    await expect(
      this.page.locator('[class*="error"], [role="alert"]').first(),
    ).toBeVisible();
  }
}
