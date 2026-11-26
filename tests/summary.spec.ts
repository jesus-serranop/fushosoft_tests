import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { SummaryPage } from './pages/SummaryPage';

// Credentials come from the project's existing ADMIN_USER / ADMIN_PASSWORD variables
const EMAIL = process.env.ADMIN_USER;
const PASSWORD = process.env.ADMIN_PASSWORD;
if (!EMAIL || !PASSWORD) {
  throw new Error('ADMIN_USER and ADMIN_PASSWORD must be set');
}

test.describe('Summary Dashboard', () => {
  // Log in once before each test and land on /summary
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(EMAIL, PASSWORD);
  });

  test('summary page loads with all four metric cards visible', async ({ page }) => {
    // Verifies the dashboard renders the core KPI cards after login
    const summaryPage = new SummaryPage(page);
    await summaryPage.expectOnSummaryPage();
    await summaryPage.expectMetricCardsVisible();
  });

  test('"Juegos del día" tab is visible and shows content or empty state', async ({ page }) => {
    // Clicking the tab should reveal either scheduled games or the empty-state message
    const summaryPage = new SummaryPage(page);
    await summaryPage.clickJuegosDelDiaTab();
    await summaryPage.expectJuegosDelDiaContentVisible();
  });

  test('"Jugadores suspendidos" tab is visible and responds to click', async ({ page }) => {
    // Switching to the Jugadores suspendidos tab should keep the section visible
    const summaryPage = new SummaryPage(page);
    await summaryPage.clickJugadoresSuspendidosTab();
    await summaryPage.expectJugadoresSuspendidosContentVisible();
  });

  test('category chart sections are visible on the dashboard', async ({ page }) => {
    // Both bar-chart sections (Juegos pendientes / Suspendidos) must be rendered
    const summaryPage = new SummaryPage(page);
    await summaryPage.expectChartsVisible();
  });

  test('unauthenticated access to /summary redirects to login', async ({ browser }) => {
    // Accessing the protected route directly without a session should redirect to auth.
    // Use a fresh context so no cookies or web storage (localStorage/sessionStorage) from the login persist.
    const context = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      storageState: { cookies: [], origins: [] },
    });
    const freshPage = await context.newPage();
    await freshPage.goto('/summary');
    await expect(freshPage).toHaveURL(/login|auth0\.com/);
    await context.close();
  });
});
