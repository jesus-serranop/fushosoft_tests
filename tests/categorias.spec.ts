import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { CategoriasPage } from './pages/CategoriasPage';

const EMAIL = process.env.TEST_USER_EMAIL ?? 'fushosoft16+testing2@gmail.com';
const PASSWORD = process.env.TEST_USER_PASSWORD ?? '';

test.describe('Categorías', () => {
  // Log in and navigate to /categorias before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs(EMAIL, PASSWORD);

    const categoriasPage = new CategoriasPage(page);
    await categoriasPage.goto();
    await categoriasPage.expectOnCategoriasPage();
  });

  test('categories list loads with at least one category visible', async ({ page }) => {
    // After navigating, the category cards should be rendered
    const categoriasPage = new CategoriasPage(page);
    await categoriasPage.expectCategoryListVisible();
  });

  test('search filters category list in real-time', async ({ page }) => {
    // Typing a letter should reduce the displayed categories to matching ones
    const categoriasPage = new CategoriasPage(page);

    // Use a broad term likely to match at least one existing category
    await categoriasPage.search('a');

    // At least one card must still be visible after filtering
    await expect(categoriasPage.categoryCards.first()).toBeVisible();
  });

  test('clearing search restores full category list', async ({ page }) => {
    // After searching and resetting, all categories should be visible again
    const categoriasPage = new CategoriasPage(page);
    const initialCount = await categoriasPage.categoryCards.count();

    await categoriasPage.search('xyz_no_match_term_99');
    // Either 0 results or partial — then clear
    await categoriasPage.clearSearch();

    // Full list should be restored
    const restoredCount = await categoriasPage.categoryCards.count();
    expect(restoredCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('search with no matching term shows empty state', async ({ page }) => {
    // Entering a term that matches nothing should result in an empty list
    const categoriasPage = new CategoriasPage(page);
    await categoriasPage.search('zzzznonexistent9999');
    await categoriasPage.expectNoResults();
  });

  test('"Crear Categoría" modal opens from the add button', async ({ page }) => {
    // Clicking the FAB add button should open the create category form
    const categoriasPage = new CategoriasPage(page);
    await categoriasPage.openCreateModal();
    await categoriasPage.expectCreateModalVisible();
  });

  test('cancelling "Crear Categoría" modal closes it without saving', async ({ page }) => {
    // Cancelling should dismiss the modal and return to the list
    const categoriasPage = new CategoriasPage(page);
    await categoriasPage.openCreateModal();
    await categoriasPage.expectCreateModalVisible();
    await categoriasPage.cancelCreateModal();
    // Modal should be gone; list is still visible
    await categoriasPage.expectOnCategoriasPage();
  });

  test('clicking a category card navigates to its details page', async ({ page }) => {
    // Each category card should be a link/button leading to the category detail
    const categoriasPage = new CategoriasPage(page);
    await categoriasPage.openFirstCategory();
    // URL should change away from /categorias
    await expect(page).not.toHaveURL(/\/categorias$/);
  });
});
