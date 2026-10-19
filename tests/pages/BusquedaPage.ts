import { Page, expect } from '@playwright/test';

/**
 * Page Object for the Búsqueda (Search) module.
 * Route: /search
 *
 * Covers the unified search input, the Jugadores and Equipos result sections,
 * empty states, and the clear/reset action.
 */
export class BusquedaPage {
  constructor(private readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────────────────────

  /** Navigate directly to the Búsqueda page. */
  async goto() {
    await this.page.goto('/search');
  }

  // ── Search input ─────────────────────────────────────────────────────────────

  /**
   * The main search input.
   * Placeholder: "Buscar jugador, equipo, categoría..."
   */
  get searchInput() {
    return this.page.getByPlaceholder(/buscar jugador/i);
  }

  /** Type a search term. Results update in real-time. */
  async search(term: string) {
    await this.searchInput.fill(term);
  }

  /** Click the X / reset button to clear the search field. */
  async clearSearch() {
    await this.page.locator('[type="reset"], button[aria-label*="clear"], ion-icon[name="close-circle"]').click();
  }

  // ── Result sections ──────────────────────────────────────────────────────────

  /** Returns the "Jugadores (N)" section header. */
  get jugadoresHeader() {
    return this.page.getByText(/jugadores\s*\(/i);
  }

  /** Returns the "Equipos (N)" section header. */
  get equiposHeader() {
    return this.page.getByText(/equipos\s*\(/i);
  }

  /** Returns the empty-state message for players. */
  get noJugadoresMessage() {
    return this.page.getByText(/no se encontraron jugadores/i);
  }

  /** Returns the empty-state message for teams. */
  get noEquiposMessage() {
    return this.page.getByText(/no se encontraron equipos/i);
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  /** Assert the page is on /search. */
  async expectOnBusquedaPage() {
    await expect(this.page).toHaveURL(/\/search/);
  }

  /** Assert both result section headers are visible. */
  async expectResultSectionsVisible() {
    await expect(this.jugadoresHeader).toBeVisible();
    await expect(this.equiposHeader).toBeVisible();
  }

  /** Assert the search input is empty (after clearing). */
  async expectSearchInputEmpty() {
    await expect(this.searchInput).toHaveValue('');
  }

  /** Assert the players empty-state message is shown. */
  async expectNoJugadoresFound() {
    await expect(this.noJugadoresMessage).toBeVisible();
  }

  /** Assert the teams empty-state message is shown. */
  async expectNoEquiposFound() {
    await expect(this.noEquiposMessage).toBeVisible();
  }
}
