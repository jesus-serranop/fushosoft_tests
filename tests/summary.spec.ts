import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { SummaryPage } from './pages/SummaryPage';

const EMAIL = process.env.TEST_USER_EMAIL ?? 'fushosoft16+testing2@gmail.com';
const PASSWORD = process.env.TEST_USER_PASSWORD ?? '';

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

  test('unauthenticated access to /summary redirects to login', async ({ page }) => {
    // Accessing the protected route directly without a session should redirect to auth
    await page.context().clearCookies();
    await page.goto('/summary');
    await expect(page).toHaveURL(/login|auth0\.com/);
  });
});
