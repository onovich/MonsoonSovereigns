import { expect, test, type Locator, type Page } from "@playwright/test";

test("web shell loads and projects the read model", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Monsoon Sovereigns" })).toBeVisible();
  await expect(page.locator(".client-shell__map-region")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Realm Map" })).toBeVisible();
  await expect(page.locator(".client-shell__debug-hidden")).toContainText(
    "Developer diagnostics are hidden in player mode."
  );
  await expect(page.getByText("M2 prototype map ready")).toHaveCount(0);
  await expect(page.getByText("Prototype District 001")).toHaveCount(0);
  await expectMountedPixiMapRenderer(page);
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-district-count",
    "30"
  );
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-settlement-count",
    "10"
  );
  await expect(page.locator(".client-shell__dev-overlay")).toHaveCount(0);
  await expect(page.locator(".client-shell__map-revision")).toHaveCount(0);
});

test("web shell resolves system language, switches language, and persists preference", async ({
  page
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      get: () => ["zh-Hans", "en-US"]
    });
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      get: () => "zh-Hans"
    });
  });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { name: "季风诸王" })).toBeVisible();
  await expect(page.getByLabel("语言")).toHaveValue("system");
  await expect(page.getByLabel("目标与行动")).toContainText("当前目标");
  await expect(page.getByLabel("虚拟化地区行")).toHaveAttribute("data-row-count", "30");
  await expect(page.getByRole("button", { name: "经济地图模式" })).toBeVisible();
  await expect(page.getByRole("button", { name: "按人口排序" })).toBeVisible();
  const activeDistrictSort = page.getByRole("button", {
    name: "按地区排序，当前升序"
  });
  await expect(activeDistrictSort).toBeVisible();
  await expect(activeDistrictSort).toContainText("地区 升序");
  await expect(activeDistrictSort).not.toContainText(/\b(?:up|down)\b/iu);
  await expect(page.getByLabel("Virtualized district rows")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Economy map mode" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sort by Population" })).toHaveCount(0);
  await expect(page.locator(".map-viewport")).toHaveAttribute(
    "aria-roledescription",
    "可键盘导航的地图只读模型"
  );
  await expect(page.locator("#map-keyboard-help")).toContainText(
    "使用方向键、Home 和 End 在地图只读模型中移动已选地区。"
  );
  await expect(page.locator("#map-selected-district-status")).toContainText(
    "已选地图地区：第 1 地区。"
  );

  await page.getByLabel("语言").selectOption("en-US");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  await expect(page.getByRole("heading", { name: "Monsoon Sovereigns" })).toBeVisible();
  await expect(page.getByLabel("Language")).toHaveValue("en-US");
  await expect(page.getByLabel("Objectives and actions")).toContainText("Current Objective");
  await expect(page.getByText("route.season.monsoon-risk")).toHaveCount(0);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  await expect(page.getByLabel("Language")).toHaveValue("en-US");
  const storedPreference = await page.evaluate(() =>
    window.localStorage.getItem("monsoon.client.localePreference.v1")
  );
  expect(storedPreference).toBe("en-US");
});

test("M7 player guidance lite supports collapse dismiss and the core appointment path", async ({
  page
}) => {
  await page.goto("/");

  const guidance = page.getByRole("region", { name: "Player guidance" });
  await expect(guidance).toHaveAttribute("data-guidance-state", "error");
  await expect(guidance).toHaveAttribute("data-guidance-evidence", "available");
  await expect(guidance).toContainText("Guidance remains under review");
  await expect(guidance).toContainText("First objective");
  await expect(guidance).toContainText("Select a district");
  await expect(guidance).toContainText("Inspect the district");
  await expect(guidance).toContainText("Preview governance");
  await expect(guidance).toContainText("Observe result");
  await expect(guidance).toContainText("Next step");
  await expect(guidance).toContainText("Preview before confirming");

  await guidance.getByRole("button", { name: "Collapse guidance" }).click();
  await expect(guidance).toHaveAttribute("data-guidance-collapsed", "true");
  await expect(guidance).not.toContainText("Inspect the district");
  await guidance.getByRole("button", { name: "Expand guidance" }).click();
  await expect(guidance).toHaveAttribute("data-guidance-collapsed", "false");

  await guidance.getByRole("button", { name: "Dismiss guidance" }).click();
  await expect(page.locator(".player-guidance-lite")).toHaveAttribute(
    "data-guidance-state",
    "dismissed"
  );
  await page.getByRole("button", { name: "Show guidance" }).click();
  await expect(guidance).toHaveAttribute("data-guidance-state", "error");

  await page
    .getByLabel("Player action queue")
    .getByRole("button", { name: "Preview Appointment" })
    .click();
  await expect(page.getByLabel("Appointment and governance flow")).toHaveAttribute(
    "data-flow-stage",
    "compare-candidates"
  );
  await expect(guidance).toContainText("Compare candidates and read the projected impact.");
  await page
    .getByLabel("Appointment and governance flow")
    .getByRole("button", {
      name: "Preview appointment"
    })
    .click();
  await page
    .getByLabel("Appointment and governance flow")
    .getByRole("button", {
      name: "Confirm appointment"
    })
    .click();
  await expect(guidance).toContainText("Appointment request prepared.");
  await expect(guidance).toContainText("Review the result, then select another pressure point.");
  await expect(page.getByText("route.season.monsoon-risk")).toHaveCount(0);
  await expect(page.getByText("Prototype District 001")).toHaveCount(0);
  await expect(page.getByText("state hash")).toHaveCount(0);
});

test("M7 player guidance lite localizes English Chinese and system fallback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      get: () => ["zh-Hans", "en-US"]
    });
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      get: () => "zh-Hans"
    });
  });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("region", { name: "玩家指引" })).toContainText("首要目标");
  await expect(page.getByRole("region", { name: "玩家指引" })).toContainText("确认前先预览");

  await page.getByLabel("语言").selectOption("en-US");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  await expect(page.getByRole("region", { name: "Player guidance" })).toContainText(
    "First objective"
  );
  await expect(page.getByRole("region", { name: "Player guidance" })).toContainText(
    "Preview before confirming"
  );

  await page.getByLabel("Language").selectOption("zh-CN");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("region", { name: "玩家指引" })).toContainText("选择地区");
  await expect(page.getByRole("region", { name: "玩家指引" })).toContainText("下一步");
  await expect(page.getByText("shell.guidanceLite")).toHaveCount(0);
});

test("M2 map zoom, selection, and mode switching updates read-model UI", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  await page.goto("/");

  const rows = page.getByLabel("Virtualized district rows");
  const panel = page.locator(".district-panel");
  const map = page.locator(".client-shell__map-surface");
  const mapCanvas = await expectMountedPixiMapRenderer(page);
  const performanceOutput = page.getByTestId("district-list-performance");

  await expect(mapCanvas).toHaveAttribute("data-renderer-owner", "map-renderer");
  await expect(mapCanvas).toHaveAttribute("data-district-count", "30");
  await expect(mapCanvas).toHaveAttribute("data-settlement-count", "10");
  await expect(mapCanvas).toHaveAttribute("data-route-count", "42");
  await expect(mapCanvas).toHaveAttribute("data-pan-x", "0.00");
  await expect(mapCanvas).toHaveAttribute("data-hovered-entity", "none");
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

  await page.getByRole("button", { name: "Pan right" }).click();
  await expect(map).toHaveAttribute("data-pan-x", "24.00");
  await expect(mapCanvas).toHaveAttribute("data-pan-x", "24.00");
  await page.getByRole("button", { name: "Reset pan" }).click();
  await expect(map).toHaveAttribute("data-pan-x", "0.00");
  await expect(mapCanvas).toHaveAttribute("data-pan-x", "0.00");
  await expect(page.getByLabel("Map legend")).toContainText("Reachable route");
  await expect(page.getByLabel("Map legend")).toContainText("Blocked route");
  await expect(page.getByLabel("Map hover details")).toContainText(
    "Hover a district or settlement for route details."
  );
  await page.getByRole("button", { name: "Review selected district District 3" }).hover();
  await expect(map).toHaveAttribute("data-hovered-district-id", "3");
  await expect(page.getByLabel("Map hover details")).toContainText("District 3");
  await expect(
    page.getByRole("button", { name: "Review selected district District 3" })
  ).toHaveAttribute("data-hovered", "true");

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
  await expect(panel).toContainText("Market settlement");
  await expect(map).toHaveAttribute("data-selected-entity-kind", "settlement");

  await page.getByLabel("Filter").fill("planting");
  await expect(rows).toHaveAttribute("data-filtered-row-count", "8");
  await expect(rows).toHaveAttribute("data-rendered-row-count", "8");

  await page.getByRole("button", { name: "Sort by Population" }).click();
  await expect(rows).toHaveAttribute("data-rendered-row-count", "8");

  const derivationMs = await readNumberAttribute(performanceOutput, "data-derivation-ms");
  const selectionMs = await readNumberAttribute(performanceOutput, "data-selection-ms");
  expect(derivationMs).toBeLessThan(50);
  expect(selectionMs).toBeLessThan(10);
  expect(consoleErrors).toEqual([]);
});

test("M7 district inspector is localized secondary browser with bounded rendering", async ({
  page
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const panel = page.locator(".district-panel");
  const browser = page.getByLabel("Route queue");
  const rows = page.getByLabel("Virtualized district rows");

  await expect(panel).toContainText("Terrain / economy");
  await expect(panel).toContainText("Governance");
  await expect(panel).toContainText("Appointment state");
  await expect(panel).toContainText("Effects");
  await expect(panel).toContainText("District actions");
  await expect(browser).toHaveAttribute("data-render-bound", "virtualized");
  await expect(rows).toHaveAttribute("data-render-limit", "16");
  await page.getByLabel("Route status").selectOption("unreachable");
  await expect(rows).toHaveAttribute("data-route-filter", "unreachable");
  await expect(rows).toHaveAttribute("data-filtered-row-count", "1");
  await page.getByLabel("Filter").fill("no matching district");
  await expect(rows).toHaveAttribute("data-filtered-row-count", "0");
  await expect(rows).toContainText("No districts match the current browser filters.");
  await page.getByRole("button", { name: "Toggle district browser" }).click();
  await expect(browser).toHaveAttribute("data-folded", "true");
  await expect(page.getByLabel("Virtualized district rows")).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle district browser" }).click();
  await expect(browser).toHaveAttribute("data-folded", "false");
  await expect(page.getByText("Prototype District 001")).toHaveCount(0);
  await expect(page.getByText("appointment.holder.skill-strong")).toHaveCount(0);
  await expect(page.getByText("route.season.monsoon-risk")).toHaveCount(0);
  await expect(page.getByText(/\bM[2-7]\b/u)).toHaveCount(0);

  await page.goto("/?fixture=district-error");
  await expect(panel).toContainText("Route is unavailable for this district.");
  await expect(panel.getByRole("button", { name: "Review obligations" })).toBeDisabled();

  await page.goto("/?fixture=district-empty");
  await expect(panel).toContainText("No District Selected");
  await expect(page.getByLabel("Virtualized district rows")).toContainText(
    "No districts match the current browser filters."
  );

  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto("/");
  await page.getByLabel("Language").selectOption("zh-CN");
  await expect(panel).toContainText("地貌 / 经济");
  await expect(panel).toContainText("任命状态");
  await expect(panel).toContainText("地区行动");
  await expect(panel).toContainText("沿海");
  await expect(panel).toContainText("驻军");
  await expect(panel).toContainText("持续");
  await expect(panel).toContainText("12 日行程");
  const localizedInspectorText = await panel.innerText();
  expect(localizedInspectorText).not.toContain("Road");
  expect(localizedInspectorText).not.toContain("road");
  expect(localizedInspectorText).not.toContain("Garrison");
  expect(localizedInspectorText).not.toContain("continuous");
  expect(localizedInspectorText).not.toMatch(/\bdays\b/u);
  await expect(page.getByLabel("路线队列")).toHaveAttribute("data-render-bound", "virtualized");
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  expect(consoleErrors).toEqual([]);
});

test("M3 appointment workspace submits appointment and bulk command DTOs", async ({ page }) => {
  await page.goto("/?debug=1");

  const workspace = page.getByLabel("M3 appointment workspace");
  await expect(workspace).toHaveAttribute("data-office-count", "3");
  await expect(workspace).toHaveAttribute("data-character-count", "4");
  await expect(workspace).toHaveAttribute("data-bulk-eligible-count", "2");
  await expect(workspace).toHaveAttribute("data-bulk-rejected-count", "1");

  await page.getByLabel("Select M3 office").selectOption("2");
  await workspace.getByLabel("Select appointment candidate").selectOption("2");
  await expect(page.getByLabel("Appointment validation reasons")).toContainText(
    "Local claimant advantage"
  );
  await expect(page.getByLabel("Appointment validation reasons")).toContainText(
    "Office eligibility failed"
  );
  await expect(page.getByLabel("Vacancy succession and obligations")).toContainText("Succession 1");
  await expect(page.getByLabel("Vacancy succession and obligations")).toContainText(
    "Regular tribute obligation"
  );
  await expect(page.getByLabel("Appointment and enfeoffment results")).toContainText(
    "Local holder settlement"
  );
  await expect(page.getByLabel("Visible reason summaries")).toContainText("Candidate unavailable");

  await page.getByRole("button", { name: "Submit appointment" }).click();
  await expect(page.getByLabel("M3 command status")).toContainText("Appointment request prepared.");

  await page.getByRole("button", { name: "Submit bulk eligible appointments" }).click();
  await expect(page.getByLabel("M3 command status")).toContainText("Appointment request prepared.");
});

test("M3 appointment player flow previews confirms result and hides raw reason codes", async ({
  page
}) => {
  await page.goto("/");

  const flow = page.getByLabel("Appointment and governance flow");
  await expect(flow).toHaveAttribute("data-flow-stage", "select-office");
  await expect(flow).toHaveAttribute("data-debug-raw-reasons", "hidden");
  await expect(page.getByLabel("M3 appointment workspace")).toHaveCount(0);
  await expect(page.getByText("office-eligibility-failed")).toHaveCount(0);
  await expect(page.getByText("appointment.local-claimant")).toHaveCount(0);

  await page
    .getByLabel("Player action queue")
    .getByRole("button", { name: "Preview Appointment" })
    .click();
  await expect(flow).toHaveAttribute("data-flow-stage", "compare-candidates");
  await page.getByLabel("Select office").selectOption("2");
  await expect(flow).toHaveAttribute("data-selected-candidate-status", "eligible");
  await expect(page.getByLabel("Candidate comparison")).toContainText("Eligible");
  await expect(page.getByLabel("Candidate comparison")).toContainText("Rejected");
  await expect(page.getByLabel("Candidate comparison")).toContainText("Local claimant advantage");
  await expect(page.getByLabel("Candidate comparison")).toContainText("Office eligibility failed");

  await flow.getByRole("button", { name: "Preview appointment" }).click();
  await expect(flow).toHaveAttribute("data-flow-stage", "preview");
  await expect(page.getByLabel("Appointment impact preview")).toContainText(
    "Appointment can be confirmed"
  );
  await expect(page.getByLabel("Appointment impact preview")).toContainText("Admin load");
  await flow.getByRole("button", { name: "Confirm appointment" }).click();
  await expect(flow).toHaveAttribute("data-flow-stage", "result");
  await expect(page.getByLabel("Appointment result feedback")).toContainText("Command submitted");
  await expect(page.getByLabel("Appointment result feedback")).toContainText(
    "Appointment request prepared."
  );
  await expect(page.getByLabel("Appointment result feedback")).toContainText(
    "standard appointment GameCommand"
  );

  await flow.locator("summary", { hasText: "Bulk preview" }).click();
  await expect(flow).toContainText("Bulk preview is informational here");
  await expect(page.getByRole("button", { name: "Submit bulk eligible appointments" })).toHaveCount(
    0
  );
});

test("M3 appointment player flow localizes Chinese and keeps rejected confirmation blocked", async ({
  page
}) => {
  await page.goto("/?fixture=appointment-error");
  await page.getByLabel("Language").selectOption("zh-CN");

  const flow = page.getByLabel("任命与治理流程");
  await expect(flow).toHaveAttribute("data-selected-candidate-status", "rejected");
  await expect(page.getByLabel("候选人比较")).toContainText("被拒绝");
  await expect(page.getByLabel("候选人比较")).toContainText("不符合职位条件");
  await flow.getByRole("button", { name: "预览任命" }).click();
  await expect(flow).toHaveAttribute("data-flow-stage", "preview");
  await expect(page.getByLabel("任命影响预览")).toContainText("只读模型拒绝此任命");
  await expect(flow.getByRole("button", { name: "确认任命" })).toBeDisabled();
  await expect(page.getByLabel("任命结果反馈")).toContainText("该候选人当前被拒绝");
  await expect(page.getByText("office-eligibility-failed")).toHaveCount(0);
});

test("M4 campaign planning submits commands and renders risks, AI reasons, and war report", async ({
  page
}) => {
  await page.goto("/?debug=1");

  const workspace = page.getByLabel("M4 campaign planning workspace");
  await expect(workspace).toHaveAttribute("data-plan-count", "2");
  await expect(workspace).toHaveAttribute("data-muster-readiness", "partial");
  await expect(workspace).toHaveAttribute("data-war-report-count", "2");
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText("Monsoon route risk");
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText(
    "Withdrawal from supply collapse"
  );
  await expect(page.getByLabel("M4 AI reasons")).toContainText(
    "AI withdraws because supply collapsed"
  );
  await expect(page.getByLabel("M4 war report")).toContainText("Postwar candidate ready");
  await expect(page.getByLabel("M4 war report")).toContainText("Restore vassal ruler option");

  await page.getByRole("button", { name: "Submit plan" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText("Campaign request prepared.");

  await page.getByRole("button", { name: "Start march" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText("Campaign request prepared.");

  await page.getByLabel("Select M4 siege choice").selectOption("assault");
  await page.getByRole("button", { name: "Submit siege choice" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText("Campaign request prepared.");

  await page.getByRole("button", { name: "Withdraw" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText("Campaign request prepared.");

  await page.getByRole("button", { name: "Cancel plan" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText("Campaign request prepared.");
});

test("M4 stress fixture renders campaign planning and war report under 4000-row pressure", async ({
  page
}) => {
  await page.goto("/?fixture=stress&debug=1");

  const workspace = page.getByLabel("M4 campaign planning workspace");
  await expect(workspace).toHaveAttribute("data-plan-count", "2");
  await expect(workspace).toHaveAttribute("data-war-report-count", "2");
  await expect(workspace.getByLabel("Select M4 campaign plan").locator("option")).toHaveCount(2);
  await expect(workspace).toContainText("Prototype District 003 / active");
  await expect(workspace).toContainText("Prototype District 002 / active");
  const districtRows = page.getByLabel("Virtualized district rows");
  await expect(districtRows).toHaveAttribute("data-row-count", "4000");
  await expect(districtRows).toHaveAttribute("data-rendered-row-count", "16");
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText("Monsoon route risk");
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText(
    "Route reservation 502"
  );
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText(
    "Route Capacity Carried Supply Over Bottleneck"
  );
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText("March 702");
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText("Siege 802");
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText("Withdrawal 902");
  await expect(page.getByLabel("M4 war report")).toContainText("Postwar candidate ready");
  await expect(page.getByLabel("M4 war report")).toContainText("Restore vassal ruler option");
  await expect(page.getByLabel("M4 war report")).toContainText("Outcome 1002");
  await page.getByRole("button", { name: "Submit plan" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText("Campaign request prepared.");
});

test("M5 playable flow previews confirms saves loads and reaches result", async ({ page }) => {
  await page.goto("/?debug=1");

  const workspace = page.getByLabel("M5 playable slice workspace");
  await expect(workspace).toHaveAttribute("data-scenario-id", "m5.composite.river-gate.v0");
  await expect(workspace).toHaveAttribute("data-phase", "not-started");
  await expect(page.getByLabel("M5 AI risk supply season")).toContainText(
    "AI withdraws because supply collapsed"
  );
  await expect(page.getByLabel("M5 AI risk supply season")).toContainText("Monsoon route risk");
  await expect(page.getByLabel("M5 postwar consequences")).toContainText("Postwar candidate ready");
  await expect(page.getByLabel("M5 postwar consequences")).toContainText(
    "Manual node battle UI is unavailable in M5."
  );

  await page.getByRole("button", { name: "Start M5 slice" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "running");
  await page.getByRole("button", { name: "Preview command" }).click();
  await expect(page.getByLabel("M5 command preview")).toHaveAttribute(
    "data-command-kind",
    "sim.create-campaign-objective"
  );
  await expect(page.getByLabel("M5 command preview")).toContainText(
    "Deterministic replay campaign reason"
  );

  await page.getByRole("button", { name: "Confirm command" }).click();
  await expect(page.getByLabel("M5 command status")).toContainText("Slice command confirmed.");
  await expect(workspace).toHaveAttribute("data-confirmed-count", "1");

  await page.getByRole("button", { name: "Save checkpoint" }).click();
  await expect(page.getByLabel("M5 save status")).toContainText("M5 Save Client Session Written");
  await expect(workspace).toHaveAttribute("data-save-present", "true");

  await page.getByRole("button", { name: "Cancel slice" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "cancelled");
  await page.getByRole("button", { name: "Load checkpoint" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "running");
  await expect(page.getByLabel("M5 save status")).toContainText("M5 Load Client Session Restored");

  for (let index = 1; index < 15; index += 1) {
    await page.getByRole("button", { name: "Preview command" }).click();
    await page.getByRole("button", { name: "Confirm command" }).click();
  }
  await expect(workspace).toHaveAttribute("data-phase", "success");
  await expect(workspace).toHaveAttribute("data-confirmed-count", "15");

  await page.getByRole("button", { name: "Preview failure" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "failure");
  await expect(page.getByLabel("M5 command preview")).toContainText(
    "Duplicate postwar governance blocked"
  );
});

test("M6 Alpha flow covers scenario, diplomacy, policy, encyclopedia, map candidate, checkpoint, and victory", async ({
  page
}) => {
  await page.goto("/?debug=1");

  const workspace = page.getByLabel("M6 Alpha start to victory workspace");
  await expect(workspace).toHaveAttribute("data-scenario-id", "m6.alpha.recognized-order.v0");
  await expect(workspace).toHaveAttribute("data-phase", "scenario-selection");
  await expect(workspace).toHaveAttribute("data-terminal-outcome", "victory");
  await expect(page.getByLabel("M6 diplomacy legitimacy succession surfaces")).toContainText(
    "tribute-recognition"
  );
  await expect(page.getByLabel("M6 diplomacy legitimacy succession surfaces")).toContainText(
    "Legitimacy Source Postwar Settlement"
  );
  await expect(page.getByLabel("M6 policy event encyclopedia surfaces")).toContainText(
    "Harbor charter petition"
  );
  await expect(page.getByLabel("M6 policy event encyclopedia surfaces")).toContainText(
    "Encyclopedia M6 Policy Event Harbor"
  );
  await expect(page.getByLabel("M6 AI adviser reasons")).toContainText(
    "Adviser sees recognized order path ready"
  );
  await expect(page.getByLabel("M6 map candidate display")).toContainText(
    "map.alpha.western-mainland-candidate"
  );
  await expect(page.getByLabel("M6 victory failure status")).toContainText(
    "Manual node battle UI is not present in Alpha."
  );

  await page.getByLabel("Select M6 Alpha scenario").selectOption("m6.alpha.pressure-monsoon.v0");
  await expect(workspace).toHaveAttribute(
    "data-selected-scenario-id",
    "m6.alpha.pressure-monsoon.v0"
  );
  await page.getByRole("button", { name: "Start Alpha" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "running");
  await page.getByRole("button", { name: "Preview Alpha command" }).click();
  await expect(page.getByLabel("M6 command preview")).toHaveAttribute(
    "data-command-kind",
    "sim.create-campaign-objective"
  );

  await page.getByRole("button", { name: "Confirm Alpha command" }).click();
  await expect(page.getByLabel("M6 command status")).toContainText("Alpha command submitted.");
  await expect(workspace).toHaveAttribute("data-confirmed-count", "1");

  await page.getByRole("button", { name: "Save Alpha checkpoint" }).click();
  await expect(page.getByLabel("M6 save status")).toContainText("M6 Save Client Session Written");
  await expect(workspace).toHaveAttribute("data-save-present", "true");

  await page.getByRole("button", { name: "Load Alpha checkpoint" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "checkpoint-loaded");
  await expect(page.getByLabel("M6 save status")).toContainText("M6 Load Client Session Restored");

  await page.getByRole("button", { name: "Start Alpha" }).click();
  for (let index = 1; index < 22; index += 1) {
    await page.getByRole("button", { name: "Preview Alpha command" }).click();
    await page.getByRole("button", { name: "Confirm Alpha command" }).click();
  }
  await expect(workspace).toHaveAttribute("data-phase", "victory");
  await expect(workspace).toHaveAttribute("data-confirmed-count", "22");

  await page.getByRole("button", { name: "Preview Alpha failure" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "failure");
  await expect(page.getByLabel("M6 command preview")).toHaveAttribute(
    "data-command-kind",
    "sim.evaluate-m6-alpha-outcome"
  );

  const majorPanelText = await workspace.textContent();
  expect(majorPanelText ?? "").not.toContain("placeholder");
  await expect(
    page.getByRole("button", { name: /\b(telemetry|account|server|mod)\b/i })
  ).toHaveCount(0);
});

test("M6 Alpha core flow exposes keyboard focus, live status, and non-color states", async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?debug=1");

  const map = page.locator(".map-viewport");
  const mapSurface = page.locator(".client-shell__map-surface");

  await page.getByRole("button", { name: "Seasonal map mode" }).focus();
  await expect(page.getByRole("button", { name: "Seasonal map mode" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Economy map mode" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Routes map mode" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Zoom out" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Zoom in" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Pan up" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Pan left" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Reset pan" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Pan right" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Pan down" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(map).toBeFocused();
  await expect(map).toHaveAttribute("data-keyboard-navigation", "district-cycle");
  await expect(map).toHaveAttribute(
    "aria-describedby",
    "map-keyboard-help map-selected-district-status"
  );
  await expect(map).toHaveAttribute("aria-roledescription", "keyboard navigable map read model");
  await expect(page.locator("#map-selected-district-status")).toContainText(
    "Selected map district:"
  );
  await page.keyboard.press("ArrowRight");
  await expect(mapSurface).toHaveAttribute("data-selected-district-id", "2");
  await expect(map).toHaveAttribute("data-selected-district-label", /.+/);
  await expect(page.locator("#map-selected-district-status")).toContainText(
    "Selected map district: District 2."
  );
  await expectFocusOutline(map);

  const workspace = page.getByLabel("M6 Alpha start to victory workspace");
  const commandStatus = page.getByRole("status", { name: "M6 command status" });
  const saveStatus = page.getByRole("status", { name: "M6 save status" });
  const scenario = page.getByLabel("Select M6 Alpha scenario");
  await expect(workspace).toHaveAttribute("aria-describedby", "m6-alpha-accessibility-status");
  await expect(scenario).toHaveAttribute("aria-describedby", "m6-alpha-scenario-description");
  await expect(page.locator("#m6-alpha-scenario-description")).toContainText(
    "Recognized order path; primary-victory; day 0."
  );
  await expect(page.getByRole("button", { name: "Start Alpha" })).toHaveAttribute(
    "aria-describedby",
    "m6-alpha-command-description"
  );
  await expect(commandStatus).toHaveAttribute("data-status-kind", "idle");
  await expect(commandStatus).toHaveAttribute("aria-describedby", "m6-alpha-command-description");
  await expect(commandStatus).toContainText("No Alpha command submitted");
  await expect(saveStatus).toHaveAttribute("data-status-kind", "empty");
  await expect(saveStatus).toHaveAttribute("aria-describedby", "m6-alpha-save-description");
  await expect(saveStatus).toContainText("No client checkpoint");

  await scenario.focus();
  await expectFocusOutline(scenario);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Start Alpha" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(workspace).toHaveAttribute("data-phase", "running");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Preview Alpha command" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("M6 command preview")).toHaveAttribute(
    "data-result-status",
    "pending"
  );
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Confirm Alpha command" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(commandStatus).toHaveAttribute("data-status-kind", "submitted");
  await expect(commandStatus).toContainText("Alpha command submitted.");
  await expect(workspace).toHaveAttribute("data-confirmed-count", "1");

  await page.getByRole("button", { name: "Save Alpha checkpoint" }).focus();
  await page.keyboard.press("Enter");
  await expect(saveStatus).toHaveAttribute("data-status-kind", "written");
  await page.getByRole("button", { name: "Load Alpha checkpoint" }).focus();
  await page.keyboard.press("Enter");
  await expect(saveStatus).toHaveAttribute("data-status-kind", "restored");
  await expect(workspace).toHaveAttribute("data-phase", "checkpoint-loaded");
  await expect(page.getByLabel("M6 policy event encyclopedia surfaces")).toContainText(
    "Grant bounded harbor duties"
  );
  await expect(page.getByLabel("M6 policy event encyclopedia surfaces")).toContainText(
    "Reject until obligations clear"
  );

  const reducedMotion = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  expect(reducedMotion).toBe(true);
  const transitionDuration = await workspace.evaluate(
    (element) => window.getComputedStyle(element).transitionDuration
  );
  expect(parseCssDurationMs(transitionDuration)).toBeLessThanOrEqual(0.01);
});

test("M7 tutorial hints encyclopedia flow exposes Beta review surfaces without scope expansion", async ({
  page
}) => {
  await page.goto("/?debug=1");

  const workspace = page.getByLabel("M7 tutorial hints encyclopedia workspace");
  await expect(workspace).toHaveAttribute("data-tutorial-step-count", "7");
  await expect(workspace).toHaveAttribute("data-encyclopedia-entry-count", "9");
  await expect(workspace).toHaveAttribute("data-not-content-lock-acceptance", "true");
  await expect(workspace).toHaveAttribute(
    "data-manual-node-battle-decision",
    "DEFER_MANUAL_NODE_BATTLE"
  );
  await expect(page.getByLabel("M7 tutorial steps")).toContainText(
    "M1: Command, query, and checkpoint authority"
  );
  await expect(page.getByLabel("M7 review summary and blockers")).toContainText(
    "Formal content lock acceptance remains outside this UI task."
  );

  await page.getByRole("tab", { name: "Hints" }).click();
  await expect(workspace).toHaveAttribute("data-active-surface", "hints");
  await expect(page.getByLabel("M7 contextual hints")).toContainText(
    "Route hints mirror forecast reason chips"
  );
  await expect(page.getByLabel("M7 contextual hints")).toContainText("Review state visible");

  await page.getByRole("tab", { name: "Encyclopedia" }).click();
  await expect(workspace).toHaveAttribute("data-active-surface", "encyclopedia");
  await expect(page.getByLabel("M7 encyclopedia entries")).toContainText(
    "M7: M7 Beta review labels"
  );
  await expect(page.getByLabel("M7 encyclopedia entries")).toContainText("INFERRED");
  await expect(page.getByLabel("M7 encyclopedia entries")).toContainText(
    "Forced movement and population-loss review"
  );
  await expect(page.getByLabel("M7 encyclopedia entries")).toContainText(
    "Composite court broker 1531"
  );
  await expect(page.getByLabel("M7 encyclopedia entries")).toContainText(
    "CULTURE_HUMAN_GATE_REQUIRED"
  );
  await expect(page.getByLabel("M7 review summary and blockers")).toContainText(
    "Language review required"
  );
  await expect(page.getByLabel("M7 review summary and blockers")).toContainText(
    "Manual node battle deferred"
  );

  await page.getByRole("tab", { name: "Coverage" }).click();
  await expect(workspace).toHaveAttribute("data-active-surface", "coverage");
  await expect(page.getByLabel("M7 audio art localization coverage")).toHaveAttribute(
    "data-locale-count",
    "2"
  );
  await expect(page.getByLabel("M7 audio art localization coverage")).toHaveAttribute(
    "data-asset-reference-count",
    "8"
  );
  await expect(page.getByLabel("M7 supported locale matrix")).toContainText("zh-Hans");
  await expect(page.getByLabel("M7 asset reference manifest")).toContainText(
    "audio.ui.risk-warning"
  );
  await expect(page.getByLabel("M7 localization checks")).toContainText("loc.content-record.keys");
  await expect(page.getByLabel("M7 viewport smoke coverage")).toContainText("viewport.1280x720");
  await expect(page.getByLabel("M7 post-1.0 gaps and risks")).toContainText(
    "risk.culture-specific-assets-blocked"
  );

  await page
    .getByLabel("Select M7 Beta scenario")
    .selectOption("scenario.beta.1581.succession-fracture");
  await expect(workspace).toHaveAttribute(
    "data-selected-scenario-id",
    "scenario.beta.1581.succession-fracture"
  );
  await expect(page.getByLabel("M7 selected scenario guidance")).toContainText(
    "1581 Succession Fracture Composite Scenario"
  );

  const m7Text = await workspace.textContent();
  expect(m7Text ?? "").not.toContain("placeholder-only");
  await expect(
    page.getByRole("button", { name: /\b(telemetry|account|server|mod)\b/i })
  ).toHaveCount(0);
});

test("M7 design tokens are available to the web shell map flow without final art authority", async ({
  page
}) => {
  await page.goto("/");

  const tokens = await page.evaluate(() => {
    const styles = window.getComputedStyle(document.documentElement);
    return {
      surfaceInk: styles.getPropertyValue("--ms-color-surface-ink").trim(),
      accentRiver: styles.getPropertyValue("--ms-color-accent-river").trim(),
      accentCopper: styles.getPropertyValue("--ms-color-accent-copper").trim(),
      radiusControl: styles.getPropertyValue("--ms-radius-control").trim()
    };
  });
  const mapCanvas = await expectMountedPixiMapRenderer(page);

  expect(tokens).toEqual({
    surfaceInk: "#172126",
    accentRiver: "#2f6f73",
    accentCopper: "#b88746",
    radiusControl: "4px"
  });
  await page.getByRole("button", { name: "Routes map mode" }).click();
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-map-mode",
    "routes"
  );
  await expect(mapCanvas).toHaveAttribute("data-map-mode", "routes");
  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(mapCanvas).toHaveAttribute("data-zoom-level", "1.25");
  await expect(page.locator('[data-final-art-approved="true"]')).toHaveCount(0);
  await expect(mapCanvas).toBeVisible();
});

test("M3 appointment workspace fits a 1440px desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/?debug=1");

  const overflow = await page.evaluate(() => {
    const grid = document.querySelector(".m3-appointment__grid");
    if (grid === null) {
      throw new Error("Expected M3 appointment grid.");
    }
    const gridBox = grid.getBoundingClientRect();
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      gridRight: gridBox.right
    };
  });

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  expect(overflow.gridRight).toBeLessThanOrEqual(overflow.clientWidth);
});

test("M3 appointment player flow has no horizontal overflow across required viewports", async ({
  page
}) => {
  const viewports = [
    { width: 1280, height: 720 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1080 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/?fixture=appointment-extreme");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "20px";
    });
    await expect(page.getByLabel("Appointment and governance flow")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const flow = document.querySelector(".m3-flow");
      if (flow === null) {
        throw new Error("Expected M3 appointment player flow.");
      }
      const flowBox = flow.getBoundingClientRect();
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        flowRight: flowBox.right
      };
    });

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    expect(overflow.flowRight).toBeLessThanOrEqual(overflow.clientWidth);
  }
});

test("M5 workspace has no horizontal overflow across required desktop viewports", async ({
  page
}) => {
  const viewports = [
    { width: 1280, height: 720 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1080 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/?debug=1");
    await expect(page.getByLabel("M5 playable slice workspace")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const workspace = document.querySelector(".m5-playable");
      if (workspace === null) {
        throw new Error("Expected M5 playable workspace.");
      }
      const workspaceBox = workspace.getBoundingClientRect();
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        workspaceRight: workspaceBox.right
      };
    });

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    expect(overflow.workspaceRight).toBeLessThanOrEqual(overflow.clientWidth);
  }
});

test("M6 Alpha workspace has no horizontal overflow across required desktop viewports", async ({
  page
}) => {
  const viewports = [
    { width: 1280, height: 720 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1080 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/?debug=1");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "20px";
    });
    await expect(page.getByLabel("M6 Alpha start to victory workspace")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const workspace = document.querySelector(".m6-alpha");
      if (workspace === null) {
        throw new Error("Expected M6 Alpha workspace.");
      }
      const workspaceBox = workspace.getBoundingClientRect();
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        workspaceRight: workspaceBox.right
      };
    });

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    expect(overflow.workspaceRight).toBeLessThanOrEqual(overflow.clientWidth);
  }
});

test("M7 guidance workspace has no horizontal overflow across required viewports", async ({
  page
}) => {
  const viewports = [
    { width: 1280, height: 720 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1080 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/?fixture=m7-extreme&surface=coverage&debug=1");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "20px";
    });
    await expect(page.getByLabel("M7 tutorial hints encyclopedia workspace")).toBeVisible();
    await expect(page.getByLabel("M7 audio art localization coverage")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const workspace = document.querySelector(".m7-guidance");
      if (workspace === null) {
        throw new Error("Expected M7 guidance workspace.");
      }
      const workspaceBox = workspace.getBoundingClientRect();
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        workspaceRight: workspaceBox.right
      };
    });

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    expect(overflow.workspaceRight).toBeLessThanOrEqual(overflow.clientWidth);
  }
});

test("M7 UI regression matrix stays localized, console-clean, and key-free across supported viewports", async ({
  page
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  const scenarios = [
    {
      viewport: { width: 1280, height: 720 },
      localePreference: "system" as const,
      browserLocales: ["zh-Hans", "en-US"],
      expectedLang: "zh-CN"
    },
    {
      viewport: { width: 1280, height: 800 },
      localePreference: "en-US" as const,
      browserLocales: ["fr-FR", "en-US"],
      expectedLang: "en-US"
    },
    {
      viewport: { width: 1920, height: 1080 },
      localePreference: "zh-CN" as const,
      browserLocales: ["en-US"],
      expectedLang: "zh-CN"
    }
  ];

  for (const scenario of scenarios) {
    consoleErrors.length = 0;
    await page.setViewportSize(scenario.viewport);
    await page.addInitScript(
      ({
        localePreference,
        browserLocales
      }: {
        readonly localePreference: "system" | "en-US" | "zh-CN";
        readonly browserLocales: readonly string[];
      }) => {
        window.localStorage.setItem("monsoon.client.localePreference.v1", localePreference);
        Object.defineProperty(window.navigator, "languages", {
          configurable: true,
          get: () => browserLocales
        });
        Object.defineProperty(window.navigator, "language", {
          configurable: true,
          get: () => browserLocales[0] ?? "en-US"
        });
      },
      {
        localePreference: scenario.localePreference,
        browserLocales: scenario.browserLocales
      }
    );
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", scenario.expectedLang);
    await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
      "data-district-count",
      "30"
    );
    await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
      "data-settlement-count",
      "10"
    );
    await expect(page.locator(".client-shell__dev-overlay")).toHaveCount(0);
    await expect(page.getByText("M2 prototype map ready")).toHaveCount(0);
    await expect(page.getByText("Prototype District 001")).toHaveCount(0);
    await expect(page.getByText("state hash")).toHaveCount(0);

    const visibleText = await page.locator("body").innerText();
    expectNoRawPlayerKeys(visibleText);
    expect(visibleText).not.toContain("placeholder-only");
    expect(visibleText).not.toContain("prototype-only");

    if (scenario.localePreference === "system") {
      const languageSelect = page.getByLabel(/^(Language|语言)$/u);
      await expect(languageSelect).toHaveValue("system");
      await languageSelect.selectOption("en-US");
      await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
      await languageSelect.selectOption("zh-CN");
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
      await expect(
        await page.evaluate(() => window.localStorage.getItem("monsoon.client.localePreference.v1"))
      ).toBe("zh-CN");
    }

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    expect(consoleErrors).toEqual([]);
  }
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

async function expectFocusOutline(locator: Locator): Promise<void> {
  const outlineStyle = await locator.evaluate(
    (element) => window.getComputedStyle(element).outlineStyle
  );
  expect(outlineStyle).not.toBe("none");
}

function parseCssDurationMs(value: string): number {
  if (value.endsWith("ms")) {
    return Number(value.slice(0, -2));
  }
  if (value.endsWith("s")) {
    return Number(value.slice(0, -1)) * 1000;
  }

  return Number.NaN;
}

function expectNoRawPlayerKeys(text: string): void {
  const rawKeyMatches = text.match(
    /\b(?:shell|appointment|map|reason|settings|m[0-9]+)(?:[.-][a-z0-9-]+)+\b/giu
  );
  expect(rawKeyMatches ?? []).toEqual([]);
}
