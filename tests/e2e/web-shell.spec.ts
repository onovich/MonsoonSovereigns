import { expect, test } from "@playwright/test";

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
