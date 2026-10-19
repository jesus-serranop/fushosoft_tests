import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { BusquedaPage } from './pages/BusquedaPage';

const EMAIL = process.env.TEST_USER_EMAIL ?? 'fushosoft16+testing2@gmail.com';
const PASSWORD = process.env.TEST_USER_PASSWORD ?? '';

test.describe('Búsqueda', () => {
  // Log in and navigate to /search before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(EMAIL, PASSWORD);

    const busquedaPage = new BusquedaPage(page);
    await busquedaPage.goto();
    await busquedaPage.expectOnBusquedaPage();
  });

  test('search page loads with Jugadores and Equipos sections visible', async ({ page }) => {
    // Both result sections must be rendered on page load
    const busquedaPage = new BusquedaPage(page);
    await busquedaPage.expectResultSectionsVisible();
  });

  test('entering a search term populates both result sections', async ({ page }) => {
    // Typing triggers real-time results; both section headers should remain visible
    const busquedaPage = new BusquedaPage(page);
    await busquedaPage.search('a');
    await busquedaPage.expectResultSectionsVisible();
  });

  test('search with no match shows empty-state messages for both sections', async ({ page }) => {
    // A term that matches nothing should show the no-results messages
    const busquedaPage = new BusquedaPage(page);
    await busquedaPage.search('zzzznonexistent9999');
    await busquedaPage.expectNoJugadoresFound();
    await busquedaPage.expectNoEquiposFound();
  });

  test('clearing the search input resets the result sections', async ({ page }) => {
    // After clearing, the search field must be empty and sections visible
    const busquedaPage = new BusquedaPage(page);
    await busquedaPage.search('algo');
    await busquedaPage.clearSearch();
    await busquedaPage.expectSearchInputEmpty();
    await busquedaPage.expectResultSectionsVisible();
  });

  test('search input accepts free-text and updates results without page reload', async ({ page }) => {
    // Real-time update: no navigation should occur when typing
    const busquedaPage = new BusquedaPage(page);
    await busquedaPage.search('Victor');
    // Still on /search after typing
    await busquedaPage.expectOnBusquedaPage();
    await busquedaPage.expectResultSectionsVisible();
  });
});
