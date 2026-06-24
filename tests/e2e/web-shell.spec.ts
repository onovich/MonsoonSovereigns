import { expect, test, type Locator, type Page } from "@playwright/test";

test("web shell loads and projects the read model", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Monsoon Sovereigns" })).toBeVisible();
  await expect(page.getByLabel("Map read model projection")).toBeVisible();
  await expect(page.getByText("M2 prototype map ready")).toBeVisible();
  await expectMountedPixiMapRenderer(page);
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-district-count",
    "30"
  );
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-settlement-count",
    "10"
  );
  await expect(page.locator(".client-shell__map-revision")).toContainText("Revision 30");
});

test("M2 map zoom, selection, and mode switching updates read-model UI", async ({ page }) => {
  await page.goto("/");

  const rows = page.getByLabel("Virtualized district rows");
  const panel = page.getByLabel("M2 district panel");
  const map = page.locator(".client-shell__map-surface");
  const mapCanvas = await expectMountedPixiMapRenderer(page);
  const performanceOutput = page.getByTestId("district-list-performance");

  await expect(mapCanvas).toHaveAttribute("data-renderer-owner", "map-renderer");
  await expect(mapCanvas).toHaveAttribute("data-district-count", "30");
  await expect(mapCanvas).toHaveAttribute("data-settlement-count", "10");
  await expect(mapCanvas).toHaveAttribute("data-route-count", "42");
  await expect(rows).toHaveAttribute("data-row-count", "30");
  await expect(rows).toHaveAttribute("data-rendered-row-count", "16");
  await expect(panel).toHaveAttribute("data-selected-district-id", "1");
  await expect(map).toHaveAttribute("data-selected-district-id", "1");
  await expect(map).toHaveAttribute("data-map-mode", "seasonal");
  await expect(map).toHaveAttribute("data-zoom-level", "1.00");
  await expect(mapCanvas).toHaveAttribute("data-map-mode", "seasonal");

  await page.getByRole("button", { name: "Economy map mode" }).click();
  await expect(map).toHaveAttribute("data-map-mode", "economy");
  await expect(mapCanvas).toHaveAttribute("data-map-mode", "economy");

  await page.getByRole("button", { name: "Routes map mode" }).click();
  await expect(map).toHaveAttribute("data-map-mode", "routes");
  await expect(mapCanvas).toHaveAttribute("data-map-mode", "routes");

  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(map).toHaveAttribute("data-zoom-level", "1.25");
  await expect(mapCanvas).toHaveAttribute("data-zoom-level", "1.25");

  await clickMapPoint(mapCanvas, 150, 50);
  await expect(panel).toHaveAttribute("data-selected-district-id", "2");
  await expect(map).toHaveAttribute("data-selected-district-id", "2");
  await expect(panel).toContainText("Population");
  await expect(panel).toContainText("Labor");
  await expect(panel).toContainText("Grain");
  await expect(panel).toContainText("Cash");
  await expect(panel).toContainText("Route");

  await clickMapPoint(mapCanvas, 168, 64);
  await expect(panel).toHaveAttribute("data-selected-district-id", "2");
  await expect(panel).toContainText("Prototype Settlement 001");
  await expect(map).toHaveAttribute("data-selected-entity-kind", "settlement");

  await page.getByLabel("Filter districts").fill("planting");
  await expect(rows).toHaveAttribute("data-filtered-row-count", "8");
  await expect(rows).toHaveAttribute("data-rendered-row-count", "8");

  await page.getByRole("button", { name: "Sort by Population" }).click();
  await expect(rows).toHaveAttribute("data-rendered-row-count", "8");

  const derivationMs = await readNumberAttribute(performanceOutput, "data-derivation-ms");
  const selectionMs = await readNumberAttribute(performanceOutput, "data-selection-ms");
  expect(derivationMs).toBeLessThan(50);
  expect(selectionMs).toBeLessThan(10);
});

async function expectMountedPixiMapRenderer(page: Page): Promise<Locator> {
  const host = page.locator(".map-viewport");
  await expect(host).toHaveAttribute("data-renderer-status", "mounted");
  await expect(host).not.toHaveAttribute("data-renderer-error", /.+/);

  const mapCanvas = page.locator(".pixi-map__canvas");
  await expect(mapCanvas).toHaveAttribute("data-renderer-owner", "map-renderer");
  return mapCanvas;
}

async function readNumberAttribute(locator: Locator, attributeName: string): Promise<number> {
  const value = await locator.getAttribute(attributeName);
  if (value === null) {
    throw new Error(`Expected ${attributeName} attribute.`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected ${attributeName} to be numeric, received ${value}.`);
  }

  return parsed;
}

async function clickMapPoint(
  locator: Locator,
  xInMapUnits: number,
  yInMapUnits: number
): Promise<void> {
  const scale = await readNumberAttribute(locator, "data-map-scale");
  const offsetX = await readNumberAttribute(locator, "data-map-offset-x");
  const offsetY = await readNumberAttribute(locator, "data-map-offset-y");
  await locator.click({
    position: {
      x: offsetX + xInMapUnits * scale,
      y: offsetY + yInMapUnits * scale
    }
  });
}
