import { expect, test, type Locator } from "@playwright/test";

test("web shell loads and projects the read model", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Monsoon Sovereigns" })).toBeVisible();
  await expect(page.getByLabel("Map read model projection")).toBeVisible();
  await expect(page.getByText("Simulation shell ready")).toBeVisible();
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-anchor-count",
    "3"
  );
  await expect(page.locator(".client-shell__map-revision")).toContainText("Revision 30");
});

test("district list virtualizes 4000 rows and hands selection to the panel and map", async ({
  page
}) => {
  await page.goto("/");

  const virtualizedRows = page.getByLabel("Virtualized 4000 district rows");
  const panel = page.getByLabel("M2 district panel");
  const map = page.locator(".client-shell__map-surface");
  const performanceOutput = page.getByTestId("district-list-performance");

  await expect(virtualizedRows).toHaveAttribute("data-row-count", "4000");
  await expect(virtualizedRows).toHaveAttribute("data-rendered-row-count", "16");
  await expect(panel).toHaveAttribute("data-selected-district-id", "1");
  await expect(map).toHaveAttribute("data-selected-district-id", "1");

  await page.getByLabel("Filter districts").fill("planting");
  await expect(virtualizedRows).toHaveAttribute("data-filtered-row-count", "1000");
  await expect(virtualizedRows).toHaveAttribute("data-rendered-row-count", "16");

  await page.getByRole("button", { name: "Select Synthetic District 0002" }).click();
  await expect(panel).toHaveAttribute("data-selected-district-id", "2");
  await expect(map).toHaveAttribute("data-selected-district-id", "2");
  await expect(panel).toContainText("Population");
  await expect(panel).toContainText("Labor");
  await expect(panel).toContainText("Grain");
  await expect(panel).toContainText("Cash");
  await expect(panel).toContainText("Route");

  await page.getByRole("button", { name: "Sort by Population" }).click();
  await expect(virtualizedRows).toHaveAttribute("data-rendered-row-count", "16");

  const derivationMs = await readNumberAttribute(performanceOutput, "data-derivation-ms");
  const selectionMs = await readNumberAttribute(performanceOutput, "data-selection-ms");
  expect(derivationMs).toBeLessThan(50);
  expect(selectionMs).toBeLessThan(10);
});

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
