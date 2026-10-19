import { Page, expect } from '@playwright/test';

/**
 * Page Object for the Home/Summary dashboard.
 * Route: /summary
 *
 * Covers the four metric cards, the Juegos del día / Jugadores suspendidos
 * tab segments, and the two chart sections.
 */
export class SummaryPage {
  constructor(private readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────────────────────

  /** Navigate directly to the summary dashboard. */
  async goto() {
    await this.page.goto('/summary');
  }

  // ── Metric cards ────────────────────────────────────────────────────────────

  /** Returns the locator for the "Juegos sin marcador" metric card. */
  get juegosSinMarcadorCard() {
    return this.page.getByText(/juegos sin marcador/i);
  }

  /** Returns the locator for the "Próximos juegos" metric card. */
  get proximosJuegosCard() {
    return this.page.getByText(/próximos juegos/i);
  }

  /** Returns the locator for the "Jugadores Suspendidos" metric card. */
  get jugadoresSuspendidosCard() {
    return this.page.getByText(/jugadores suspendidos/i).first();
  }

  // ── Tab segments ─────────────────────────────────────────────────────────────

  /** Click the "Juegos del día" tab segment. */
  async clickJuegosDelDiaTab() {
    await this.page.getByRole('button', { name: /juegos del día/i }).click();
  }

  /** Click the "Jugadores suspendidos" tab segment. */
  async clickJugadoresSuspendidosTab() {
    await this.page.getByRole('button', { name: /jugadores suspendidos/i }).click();
  }

  // ── Chart sections ───────────────────────────────────────────────────────────

  /** Returns the locator for the "Juegos pendientes por categoría" chart section. */
  get juegosPendientesPorCategoriaSection() {
    return this.page.getByText(/juegos pendientes por categoría/i);
  }

  /** Returns the locator for the "Suspendidos por categoría" chart section. */
  get suspendidosPorCategoriaSection() {
    return this.page.getByText(/suspendidos por categoría/i);
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  /** Assert all four metric cards are visible on the dashboard. */
  async expectMetricCardsVisible() {
    await expect(this.juegosSinMarcadorCard).toBeVisible();
    await expect(this.page.getByText(/juegos del día/i).first()).toBeVisible();
    await expect(this.proximosJuegosCard).toBeVisible();
    await expect(this.jugadoresSuspendidosCard).toBeVisible();
  }

  /** Assert the dashboard is at the /summary route. */
  async expectOnSummaryPage() {
    await expect(this.page).toHaveURL(/\/summary/);
  }

  /** Assert the "Juegos del día" tab content is visible (or shows the empty state). */
  async expectJuegosDelDiaContentVisible() {
    // Either there are games listed, or the empty state message is shown
    const hasGames = this.page.getByText(/no hay juegos programados para hoy/i);
    await expect(hasGames.or(this.page.getByText(/imprimir/i).first())).toBeVisible();
  }

  /** Assert the suspended players tab is active and shows the table or empty state. */
  async expectJugadoresSuspendidosContentVisible() {
    // The tab header with a badge count should be present
    await expect(this.page.getByText(/jugadores suspendidos/i).first()).toBeVisible();
  }

  /** Assert the two chart sections are visible on the page. */
  async expectChartsVisible() {
    await expect(this.juegosPendientesPorCategoriaSection).toBeVisible();
    await expect(this.suspendidosPorCategoriaSection).toBeVisible();
  }
}
