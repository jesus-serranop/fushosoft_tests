import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const EMAIL = process.env.TEST_USER_EMAIL ?? 'fushosoft16+testing2@gmail.com';
const PASSWORD = process.env.TEST_USER_PASSWORD ?? '';

test.describe('Login', () => {
  test('login page shows the "Iniciar sesión" button', async ({ page }) => {
    // Verifies that the app login page loads and presents the Auth0 redirect button
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectLoginPageVisible();
  });

  test('successful login redirects to the dashboard', async ({ page }) => {
    // Full happy path: click the app button → Auth0 form → redirect to /summary
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(EMAIL, PASSWORD);
    await loginPage.expectDashboardVisible();
  });

  test('dashboard summary cards are visible after login', async ({ page }) => {
    // After logging in, the Home page must show the key summary metrics
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(EMAIL, PASSWORD);

    // Expect the two main summary tabs to be visible
    await expect(page.getByText(/juegos del día/i)).toBeVisible();
    await expect(page.getByText(/jugadores suspendidos/i)).toBeVisible();
  });

  test('invalid credentials show an error on Auth0', async ({ page }) => {
    // Validates that Auth0 rejects wrong passwords with a visible error
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickIniciarSesion();
    await page.waitForURL(/auth0\.com/);

    await loginPage.fillEmail(EMAIL);
    await loginPage.submitAuth0Form();
    await loginPage.fillPassword('WrongPassword!999');
    await loginPage.submitAuth0Form();

    await loginPage.expectAuth0ErrorVisible();
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    // Accessing a protected route without a session should redirect to login
    await page.goto('/summary');
    // Auth guard redirects either to /login or to Auth0
    await expect(page).toHaveURL(/login|auth0\.com/);
  });
});
