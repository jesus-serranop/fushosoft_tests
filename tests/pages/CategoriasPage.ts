import { Page, expect } from '@playwright/test';

/**
 * Page Object for the Categorías module.
 * Route: /categorias
 *
 * Covers the category list, real-time search/filter, and the
 * "Crear Categoría" modal form.
 */
export class CategoriasPage {
  constructor(private readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────────────────────

  /** Navigate directly to the Categorías page. */
  async goto() {
    await this.page.goto('/categorias');
  }

  // ── Search / Filter ─────────────────────────────────────────────────────────

  /** Returns the search input locator. */
  get searchInput() {
    return this.page.getByRole('searchbox');
  }

  /**
   * Type a term into the search bar.
   * Results update in real-time, so no extra wait is needed.
   */
  async search(term: string) {
    await this.searchInput.fill(term);
  }

  /** Click the reset button to clear the search field. */
  async clearSearch() {
    await this.page.getByRole('button', { name: /reset/i }).click();
  }

  // ── Create category ─────────────────────────────────────────────────────────

  /** Click the add (plus) button to open the "Crear Categoría" modal. */
  async openCreateModal() {
    // The FAB / add button is in the bottom-right corner
    await this.page.locator('ion-fab-button, [aria-label*="add"], [aria-label*="agregar"]').last().click();
  }

  /** Fill the category name in the "Crear Categoría" form. */
  async fillCategoryName(name: string) {
    await this.page.getByLabel(/nombre de la categoría/i).fill(name);
  }

  /** Toggle the "Categoría por Grupos" checkbox. */
  async toggleGroupsCheckbox() {
    await this.page.getByLabel(/categoría por grupos/i).click();
  }

  /** Submit the "Crear Categoría" form. */
  async submitCreateForm() {
    await this.page.getByRole('button', { name: /guardar|crear|aceptar/i }).click();
  }

  /** Close / cancel the modal without saving. */
  async cancelCreateModal() {
    await this.page.getByRole('button', { name: /cancelar|cerrar/i }).click();
  }

  // ── Category cards ──────────────────────────────────────────────────────────

  /** Returns all category card locators currently visible. */
  get categoryCards() {
    return this.page.locator('ion-card, ion-item').filter({ hasText: /jugadores|equipos|jornadas/i });
  }

  /** Click on the first category card to navigate to its details page. */
  async openFirstCategory() {
    await this.categoryCards.first().click();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  /** Assert the page is on /categorias. */
  async expectOnCategoriasPage() {
    await expect(this.page).toHaveURL(/\/categorias/);
  }

  /** Assert the category list has at least one card visible. */
  async expectCategoryListVisible() {
    await expect(this.categoryCards.first()).toBeVisible();
  }

  /** Assert the "Crear Categoría" modal heading is visible. */
  async expectCreateModalVisible() {
    await expect(this.page.getByText(/crear categoría/i)).toBeVisible();
  }

  /**
   * Assert that the visible category cards contain the given term.
   * Uses a loose text match on the card content.
   */
  async expectFilteredResultsContain(term: string) {
    const cards = this.categoryCards;
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText(new RegExp(term, 'i'));
    }
  }

  /** Assert no category cards are shown (empty filtered state). */
  async expectNoResults() {
    await expect(this.categoryCards).toHaveCount(0);
  }
}
