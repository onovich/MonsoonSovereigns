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

test("M3 appointment workspace submits appointment and bulk command DTOs", async ({ page }) => {
  await page.goto("/");

  const workspace = page.getByLabel("M3 appointment workspace");
  await expect(workspace).toHaveAttribute("data-office-count", "3");
  await expect(workspace).toHaveAttribute("data-character-count", "4");
  await expect(workspace).toHaveAttribute("data-bulk-eligible-count", "2");
  await expect(workspace).toHaveAttribute("data-bulk-rejected-count", "1");

  await page.getByLabel("Select M3 office").selectOption("2");
  await page.getByLabel("Select appointment candidate").selectOption("2");
  await expect(page.getByLabel("Appointment validation reasons")).toContainText(
    "appointment.local-claimant"
  );
  await expect(page.getByLabel("Appointment validation reasons")).toContainText(
    "office-eligibility-failed"
  );
  await expect(page.getByLabel("Vacancy succession and obligations")).toContainText("Succession 1");
  await expect(page.getByLabel("Vacancy succession and obligations")).toContainText(
    "obligation.tribute.regular"
  );
  await expect(page.getByLabel("Appointment and enfeoffment results")).toContainText(
    "enfeoffment.local-holder"
  );
  await expect(page.getByLabel("Visible reason summaries")).toContainText("character-unavailable");

  await page.getByRole("button", { name: "Submit appointment" }).click();
  await expect(page.getByLabel("M3 command status")).toContainText(
    "sim.appoint-office ready for polity:1"
  );

  await page.getByRole("button", { name: "Submit bulk eligible appointments" }).click();
  await expect(page.getByLabel("M3 command status")).toContainText(
    "sim.appoint-offices-bulk ready for polity:1"
  );
});

test("M4 campaign planning submits commands and renders risks, AI reasons, and war report", async ({
  page
}) => {
  await page.goto("/");

  const workspace = page.getByLabel("M4 campaign planning workspace");
  await expect(workspace).toHaveAttribute("data-plan-count", "2");
  await expect(workspace).toHaveAttribute("data-muster-readiness", "partial");
  await expect(workspace).toHaveAttribute("data-war-report-count", "2");
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText(
    "route.season.monsoon-risk"
  );
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText(
    "withdrawal.reason.supply-collapse"
  );
  await expect(page.getByLabel("M4 AI reasons")).toContainText("m4.ai.withdraw.supply-collapse");
  await expect(page.getByLabel("M4 war report")).toContainText("postwar.candidate.ready");
  await expect(page.getByLabel("M4 war report")).toContainText("restore-vassal-ruler");

  await page.getByRole("button", { name: "Submit plan" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText(
    "sim.create-campaign-objective ready for polity:1"
  );

  await page.getByRole("button", { name: "Start march" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText(
    "sim.start-campaign-march ready for polity:1"
  );

  await page.getByLabel("Select M4 siege choice").selectOption("assault");
  await page.getByRole("button", { name: "Submit siege choice" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText(
    "sim.apply-m4-siege-choice ready for polity:1"
  );

  await page.getByRole("button", { name: "Withdraw" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText(
    "sim.resolve-m4-campaign-withdrawal ready for polity:1"
  );

  await page.getByRole("button", { name: "Cancel plan" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText(
    "sim.cancel-campaign-objective ready for polity:1"
  );
});

test("M4 stress fixture renders campaign planning and war report under 4000-row pressure", async ({
  page
}) => {
  await page.goto("/?fixture=stress");

  const workspace = page.getByLabel("M4 campaign planning workspace");
  await expect(workspace).toHaveAttribute("data-plan-count", "2");
  await expect(workspace).toHaveAttribute("data-war-report-count", "2");
  await expect(workspace.getByLabel("Select M4 campaign plan").locator("option")).toHaveCount(2);
  await expect(workspace).toContainText("Prototype District 003 / active");
  await expect(workspace).toContainText("Prototype District 002 / active");
  const districtRows = page.getByLabel("Virtualized district rows");
  await expect(districtRows).toHaveAttribute("data-row-count", "4000");
  await expect(districtRows).toHaveAttribute("data-rendered-row-count", "16");
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText(
    "route.season.monsoon-risk"
  );
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText(
    "Route reservation 502"
  );
  await expect(page.getByLabel("M4 supply and route forecast")).toContainText(
    "route.capacity.carried-supply-over-bottleneck"
  );
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText("March 702");
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText("Siege 802");
  await expect(page.getByLabel("M4 march siege withdrawal state")).toContainText("Withdrawal 902");
  await expect(page.getByLabel("M4 war report")).toContainText("postwar.candidate.ready");
  await expect(page.getByLabel("M4 war report")).toContainText("restore-vassal-ruler");
  await expect(page.getByLabel("M4 war report")).toContainText("Outcome 1002");
  await page.getByRole("button", { name: "Submit plan" }).click();
  await expect(page.getByLabel("M4 command status")).toContainText(
    "sim.create-campaign-objective ready for polity:1"
  );
});

test("M5 playable flow previews confirms saves loads and reaches result", async ({ page }) => {
  await page.goto("/");

  const workspace = page.getByLabel("M5 playable slice workspace");
  await expect(workspace).toHaveAttribute("data-scenario-id", "m5.composite.river-gate.v0");
  await expect(workspace).toHaveAttribute("data-phase", "not-started");
  await expect(page.getByLabel("M5 AI risk supply season")).toContainText(
    "m4.ai.withdraw.supply-collapse"
  );
  await expect(page.getByLabel("M5 AI risk supply season")).toContainText(
    "route.season.monsoon-risk"
  );
  await expect(page.getByLabel("M5 postwar consequences")).toContainText("postwar.candidate.ready");
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
    "campaign.reason.deterministic-replay"
  );

  await page.getByRole("button", { name: "Confirm command" }).click();
  await expect(page.getByLabel("M5 command status")).toContainText(
    "sim.create-campaign-objective confirmed for polity:1"
  );
  await expect(workspace).toHaveAttribute("data-confirmed-count", "1");

  await page.getByRole("button", { name: "Save checkpoint" }).click();
  await expect(page.getByLabel("M5 save status")).toContainText("m5.save.client-session-written");
  await expect(workspace).toHaveAttribute("data-save-present", "true");

  await page.getByRole("button", { name: "Cancel slice" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "cancelled");
  await page.getByRole("button", { name: "Load checkpoint" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "running");
  await expect(page.getByLabel("M5 save status")).toContainText("m5.load.client-session-restored");

  for (let index = 1; index < 15; index += 1) {
    await page.getByRole("button", { name: "Preview command" }).click();
    await page.getByRole("button", { name: "Confirm command" }).click();
  }
  await expect(workspace).toHaveAttribute("data-phase", "success");
  await expect(workspace).toHaveAttribute("data-confirmed-count", "15");

  await page.getByRole("button", { name: "Preview failure" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "failure");
  await expect(page.getByLabel("M5 command preview")).toContainText(
    "m5.slice.duplicate-postwar-governance"
  );
});

test("M6 Alpha flow covers scenario, diplomacy, policy, encyclopedia, map candidate, checkpoint, and victory", async ({
  page
}) => {
  await page.goto("/");

  const workspace = page.getByLabel("M6 Alpha start to victory workspace");
  await expect(workspace).toHaveAttribute("data-scenario-id", "m6.alpha.recognized-order.v0");
  await expect(workspace).toHaveAttribute("data-phase", "scenario-selection");
  await expect(workspace).toHaveAttribute("data-terminal-outcome", "victory");
  await expect(page.getByLabel("M6 diplomacy legitimacy succession surfaces")).toContainText(
    "tribute-recognition"
  );
  await expect(page.getByLabel("M6 diplomacy legitimacy succession surfaces")).toContainText(
    "legitimacy.source.postwar-settlement"
  );
  await expect(page.getByLabel("M6 policy event encyclopedia surfaces")).toContainText(
    "Harbor charter petition"
  );
  await expect(page.getByLabel("M6 policy event encyclopedia surfaces")).toContainText(
    "encyclopedia.m6.policy_event.harbor"
  );
  await expect(page.getByLabel("M6 AI adviser reasons")).toContainText(
    "m6.adviser.recognized-order-ready"
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
  await expect(page.getByLabel("M6 command status")).toContainText(
    "sim.create-campaign-objective submitted for polity:1"
  );
  await expect(workspace).toHaveAttribute("data-confirmed-count", "1");

  await page.getByRole("button", { name: "Save Alpha checkpoint" }).click();
  await expect(page.getByLabel("M6 save status")).toContainText("m6.save.client-session-written");
  await expect(workspace).toHaveAttribute("data-save-present", "true");

  await page.getByRole("button", { name: "Load Alpha checkpoint" }).click();
  await expect(workspace).toHaveAttribute("data-phase", "checkpoint-loaded");
  await expect(page.getByLabel("M6 save status")).toContainText("m6.load.client-session-restored");

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
  await page.goto("/");

  const map = page.getByLabel("M2 prototype map viewport");
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
  await expect(map).toBeFocused();
  await expect(map).toHaveAttribute("data-keyboard-navigation", "district-cycle");
  await expect(map).toHaveAttribute(
    "aria-describedby",
    "map-keyboard-help map-selected-district-status"
  );
  await expect(map).toHaveAttribute("aria-roledescription", "keyboard navigable map read model");
  await expect(page.locator("#map-selected-district-status")).toContainText(
    "Selected map district: Prototype District 001."
  );
  await page.keyboard.press("ArrowRight");
  await expect(mapSurface).toHaveAttribute("data-selected-district-id", "2");
  await expect(map).toHaveAttribute("data-selected-district-label", "Prototype District 002");
  await expect(page.locator("#map-selected-district-status")).toContainText(
    "Selected map district: Prototype District 002."
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
  await expect(commandStatus).toContainText("m6.command.no-alpha-command-submitted");
  await expect(saveStatus).toHaveAttribute("data-status-kind", "empty");
  await expect(saveStatus).toHaveAttribute("aria-describedby", "m6-alpha-save-description");
  await expect(saveStatus).toContainText("m6.save.no-client-checkpoint");

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
  await expect(commandStatus).toContainText("sim.create-campaign-objective submitted");
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
  await page.goto("/");

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
  await expect(page.getByLabel("M7 contextual hints")).toContainText(
    "m7.guidance.review-state-visible"
  );

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
    "LANGUAGE_REVIEW_REQUIRED"
  );
  await expect(page.getByLabel("M7 review summary and blockers")).toContainText(
    "DEFER_MANUAL_NODE_BATTLE"
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

test("M3 appointment workspace fits a 1440px desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

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
    await page.goto("/");
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
    await page.goto("/");
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
    await page.goto("/?fixture=m7-extreme&surface=coverage");
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
