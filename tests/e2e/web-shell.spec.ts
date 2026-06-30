import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test, type Locator, type Page } from "@playwright/test";

type PlatformMatrixScenario = {
  readonly label: string;
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
  readonly localePreference: "system" | "en-US" | "zh-CN";
  readonly browserLocales: readonly string[];
  readonly expectedLang: "en-US" | "zh-CN";
};

type PlatformMatrixResolutionRow = {
  readonly smokeId: string;
  readonly width: number;
  readonly height: number;
  readonly status: "pass";
};

type PlatformMatrixLocaleRow = {
  readonly localePreference: "system" | "en-US" | "zh-CN";
  readonly browserLocales: readonly string[];
  readonly expectedLang: "en-US" | "zh-CN";
  readonly status: "pass";
};

type PlatformMatrixExecutionRow = {
  readonly axis: "browser" | "desktop";
  readonly label: string;
  readonly status: "pass";
  readonly evidence: string | readonly string[];
};

type PlatformMatrixUnsupportedRow = {
  readonly axis: "browser" | "dpi";
  readonly label: string;
  readonly status: "blocked-by-tooling" | "follow-up";
  readonly reason: string;
};

type PlatformMatrixFixture = {
  readonly matrixId: "M7-PLATFORM-RESOLUTION-LOCALIZATION-MATRIX-001";
  readonly supportedScenarios: readonly PlatformMatrixScenario[];
  readonly supportedResolutions: readonly PlatformMatrixResolutionRow[];
  readonly supportedLocales: readonly PlatformMatrixLocaleRow[];
  readonly supportedExecutionRows: readonly PlatformMatrixExecutionRow[];
  readonly unsupportedRows: readonly PlatformMatrixUnsupportedRow[];
  readonly surfaceCoverage: readonly string[];
};

const platformMatrix = readPlatformMatrixFixture();

async function expectIntersectsViewport(locator: Locator): Promise<void> {
  const intersection = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return {
      height: rect.height,
      visibleHeight: Math.max(0, visibleHeight),
      visibleWidth: Math.max(0, visibleWidth),
      width: rect.width
    };
  });
  expect(intersection.width).toBeGreaterThan(0);
  expect(intersection.height).toBeGreaterThan(0);
  expect(intersection.visibleWidth).toBeGreaterThan(0);
  expect(intersection.visibleHeight).toBeGreaterThan(0);
}

async function expectMeaningfulViewportIntersection(
  locator: Locator,
  minimumVisibleAreaPx: number
): Promise<void> {
  const visibleArea = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const visibleWidth = Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return Math.max(0, visibleWidth) * Math.max(0, visibleHeight);
  });
  expect(visibleArea).toBeGreaterThanOrEqual(minimumVisibleAreaPx);
}

async function expectNoViewportOverlap(first: Locator, second: Locator): Promise<void> {
  const secondHandle = await second.elementHandle();
  if (secondHandle === null) {
    throw new Error("Expected an Element for overlap comparison.");
  }

  try {
    const overlapArea = await first.evaluate((firstElement, secondElement) => {
      if (!(secondElement instanceof Element)) {
        throw new Error("Expected an Element for overlap comparison.");
      }

      const firstRect = firstElement.getBoundingClientRect();
      const secondRect = secondElement.getBoundingClientRect();
      const overlapWidth =
        Math.min(firstRect.right, secondRect.right, window.innerWidth) -
        Math.max(firstRect.left, secondRect.left, 0);
      const overlapHeight =
        Math.min(firstRect.bottom, secondRect.bottom, window.innerHeight) -
        Math.max(firstRect.top, secondRect.top, 0);
      return Math.max(0, overlapWidth) * Math.max(0, overlapHeight);
    }, secondHandle);
    expect(overlapArea).toBe(0);
  } finally {
    await secondHandle.dispose();
  }
}

test("web shell loads and projects the read model", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Monsoon Sovereigns" })).toBeVisible();
  await expect(page.locator(".client-shell__map-region")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Realm Map" })).toBeVisible();
  await expect(page.getByText("Developer Overlay")).toHaveCount(0);
  await expect(page.getByText("Developer diagnostics")).toHaveCount(0);
  await expect(page.getByText("developer diagnostics")).toHaveCount(0);
  await expect(page.getByText("blockers")).toHaveCount(0);
  await expect(page.getByText("No action has been previewed yet.")).toBeVisible();
  await expect(page.getByLabel("Core action loop")).toContainText("Current phase");
  await expect(page.getByLabel("Core action loop")).toContainText("Main unresolved decision");
  await expect(page.getByLabel("Core action loop")).toContainText("Next primary action");
  await expect(page.getByLabel("Core action loop")).toContainText("Obligation phase");
  await expect(page.getByLabel("Selected district context")).toContainText("Handle obligation");
  await expect(page.getByLabel("Obligation handling panel")).toContainText("Obligation handling");
  await expect(page.getByLabel("Obligation handling panel")).toContainText("District 1");
  const obligationPanelText =
    (await page.getByLabel("Obligation handling panel").textContent()) ?? "";
  expect(obligationPanelText).not.toMatch(
    /read model|read-model|read-only|GameCommand|command path|raw reason|reason-code|internal jargon/i
  );
  await expectMountedPixiMapRenderer(page);
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-district-count",
    "30"
  );
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-settlement-count",
    "10"
  );
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-map-mode",
    "situation"
  );
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-map-presentation",
    "soft-strategic-regions"
  );
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-player-grid",
    "hidden"
  );
  await expect(page.getByRole("button", { name: "Situation map mode" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-visible-overlays",
    "selected route obligation settlement"
  );
  await expect(page.getByLabel("Map legend")).toContainText("Supply path for the selected focus");
  await expect(page.getByLabel("Map legend")).toContainText(
    "Obligation pressure tied to this focus"
  );
  await expect(page.getByLabel("Map legend")).not.toContainText(
    "Risk area relevant to the open task"
  );
  await expect(page.getByRole("button", { name: "Prepare obligation support" })).toBeEnabled();
  await page.getByRole("button", { name: "Prepare obligation support" }).click();
  await expect(page.getByLabel("Expanded task drawer")).toHaveAttribute(
    "data-task-drawer-expanded",
    "results"
  );
  await expect(page.getByLabel("Expanded task drawer")).toContainText(
    "District 1 Troop obligation support prepared"
  );
  await expect(page.getByText("M2 prototype map ready")).toHaveCount(0);
  await expect(page.getByText("Prototype District 001")).toHaveCount(0);
  await expect(page.locator(".client-shell__map-surface")).toHaveAttribute(
    "data-visible-overlays",
    "selected settlement"
  );
  await expect(page.getByLabel("Map legend")).not.toContainText(
    "Supply path for the selected focus"
  );
  await expect(page.getByLabel("Map legend")).not.toContainText(
    "Obligation pressure tied to this focus"
  );
  await expect(page.getByLabel("Map legend")).not.toContainText(
    "Risk area relevant to the open task"
  );
  await expect(page.locator(".client-shell__dev-overlay")).toHaveCount(0);
  await expect(page.locator(".client-shell__map-revision")).toHaveCount(0);
});

test("appointment preview and confirmation show durable player feedback", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Appointments/u }).click();
  const appointmentFlow = page.getByLabel("Appointment and governance flow");
  await expect(appointmentFlow).toBeVisible();
  await expect(appointmentFlow).toHaveAttribute("data-flow-stage", "compare-candidates");
  await expect(appointmentFlow).toHaveAttribute("data-submission-state", "idle");

  await appointmentFlow.getByRole("button", { name: "Preview appointment" }).click();
  await expect(appointmentFlow).toHaveAttribute("data-flow-stage", "preview");
  await expect(appointmentFlow).toHaveAttribute("data-submission-state", "pending");
  await expect(appointmentFlow).toContainText("Before");
  await expect(appointmentFlow).toContainText("After");
  await expect(appointmentFlow).toContainText("Cost");
  await expect(appointmentFlow).toContainText("Benefit");
  await expect(appointmentFlow).toContainText("Risk");

  const confirmButton = appointmentFlow.getByRole("button", { name: "Confirm appointment" });
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
  await expect(appointmentFlow).toHaveAttribute("data-flow-stage", "result");
  await expect(appointmentFlow).toHaveAttribute("data-submission-state", "accepted");
  await expect(appointmentFlow.getByRole("button", { name: "Accepted" })).toBeDisabled();
  await expect(appointmentFlow.getByRole("status")).toContainText("Accepted");
  await expect(appointmentFlow.getByRole("status")).toContainText("Appointment request prepared.");
  await expect(page.getByLabel("Core action loop")).toContainText("Read result");
});

test("M7 decision surface synchronizes task card map list and inspector focus", async ({
  page
}) => {
  await page.goto("/");

  const taskRail = page.getByRole("region", { name: "Task rail" });
  const mapSurface = page.locator(".client-shell__map-surface");
  const inspector = page.locator(".district-panel");
  const routeQueue = page.locator(".client-shell__route-queue");
  const activeDistrictRow = page.locator('.district-list__row[data-active-object="true"]');
  const mapLegend = page.getByLabel("Map legend");

  await expect(taskRail).toHaveAttribute("data-current-action", "obligations");
  await expect(taskRail).toHaveAttribute("data-active-object", "District 1");
  await expect(mapSurface).toHaveAttribute("data-decision-action", "obligations");
  await expect(mapSurface).toHaveAttribute("data-decision-object", "District 1");
  await expect(mapSurface).toHaveAttribute("data-selected-district-id", "1");
  await expect(inspector).toHaveAttribute("data-current-action", "obligations");
  await expect(inspector).toHaveAttribute("data-active-object", "District 1");
  await expect(routeQueue).toHaveAttribute("data-current-action", "obligations");
  await expect(routeQueue).toHaveAttribute("data-selected-district-id", "1");
  await expect(activeDistrictRow).toHaveAttribute("data-district-id", "1");
  await expect(activeDistrictRow).toHaveAttribute("data-current-action", "obligations");
  await expect(mapLegend).not.toContainText("Risk area relevant to the open task");

  await taskRail.locator('[data-task-rail-card-kind="appointments"]').click();
  await expect(taskRail).toHaveAttribute("data-current-action", "appointments");
  await expect(taskRail.locator('[data-task-rail-card-kind="appointments"]')).toHaveAttribute(
    "data-current-action",
    "true"
  );
  await expect(mapSurface).toHaveAttribute("data-decision-action", "appointments");
  await expect(inspector).toHaveAttribute("data-current-action", "appointments");
  await expect(routeQueue).toHaveAttribute("data-current-action", "appointments");
  await expect(routeQueue).toHaveAttribute("data-selected-district-id", "1");
  await expect(routeQueue).toHaveAttribute("data-folded", "true");
  await expect(inspector).toContainText("Preview appointment");
  await expect(mapSurface).toHaveAttribute("data-visible-overlays", "selected settlement");
  await expect(mapLegend).not.toContainText("Obligation pressure tied to this focus");

  await taskRail.locator('[data-task-rail-card-kind="campaign"]').click();
  await expect(taskRail).toHaveAttribute("data-current-action", "campaign");
  await expect(mapSurface).toHaveAttribute("data-decision-action", "campaign");
  await expect(inspector).toHaveAttribute("data-current-action", "campaign");
  await expect(taskRail.locator('[data-task-rail-card-kind="campaign"]')).toHaveAttribute(
    "data-current-action",
    "true"
  );
  await expect(mapLegend).toContainText("Risk area relevant to the open task");
  await expect(mapLegend).not.toContainText("read-model");
  await expect(mapLegend).not.toContainText("debug");
  await expect(mapLegend).not.toContainText("command path");
});

test("M7 systemic interaction validation captures required viewport evidence", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  const evidenceDirectory = resolve(process.cwd(), "project/messages/outbox");
  mkdirSync(evidenceDirectory, { recursive: true });

  const viewportEvidence = [
    {
      fileName: "M7-SYSTEMIC-INTERACTION-VALIDATION-001__EVIDENCE-1440x900.png",
      viewport: { width: 1440, height: 900 }
    },
    {
      fileName: "M7-SYSTEMIC-INTERACTION-VALIDATION-001__EVIDENCE-1280x720.png",
      viewport: { width: 1280, height: 720 }
    }
  ] as const;

  for (const evidence of viewportEvidence) {
    await page.setViewportSize(evidence.viewport);
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Monsoon Sovereigns" })).toBeVisible();
    await expect(page.getByLabel("Core action loop")).toContainText("Current phase");
    await expect(page.getByLabel("Core action loop")).toContainText("Main unresolved decision");
    await expect(page.getByLabel("Core action loop")).toContainText("Next primary action");
    await expect(page.getByRole("region", { name: "Task rail" })).toContainText("Obligations");
    await expect(page.getByRole("region", { name: "Task rail" })).toContainText("Appointments");
    await expect(page.getByLabel("Selected district context")).toContainText("District 1");
    await expect(page.getByLabel("Map legend")).toContainText("Supply path for the selected focus");
    await expect(page.getByLabel("Map legend")).toContainText(
      "Obligation pressure tied to this focus"
    );
    await expect(page.locator(".client-shell__dev-overlay")).toHaveCount(0);

    await page.screenshot({
      path: resolve(evidenceDirectory, evidence.fileName)
    });
  }

  expect(consoleErrors).toEqual([]);
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
  await expect(page.getByLabel("任务栏")).toContainText("任务栏");
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
  await expect(page.getByRole("button", { name: "局势地图模式" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Situation map mode" })).toHaveCount(0);
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
  await expect(page.getByLabel("Task rail")).toContainText("Task Rail");
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

  const orientation = page.getByRole("region", { name: "First screen orientation" });
  await expect(orientation).toContainText("Court Brief");
  await expect(orientation).toContainText("You are stewarding Validation Court.");
  await expect(orientation).toContainText("Monsoon watch");
  await expect(orientation).toContainText("Priority problem");
  await expect(orientation).toContainText("Recommended next action");
  await expect(orientation).toContainText("Cost");
  await expect(orientation).toContainText("If ignored");

  const taskRail = page.getByRole("region", { name: "Task rail" });
  await expect(taskRail).toHaveAttribute("data-task-rail-card-count", "6");
  await expect(taskRail).toHaveAttribute("data-active-drawer", "obligations");
  await expect(taskRail.locator('[data-task-rail-card-kind="obligations"]')).toContainText(
    "Obligations"
  );
  await expect(taskRail.locator('[data-task-rail-card-kind="appointments"]')).toContainText(
    "Preview Appointment"
  );
  await expect(taskRail.locator('[data-task-rail-card-kind="succession"]')).toContainText(
    "Succession"
  );
  await expect(taskRail.locator('[data-task-rail-card-kind="campaign"]')).toContainText(
    "Campaign prep"
  );
  await expect(taskRail.locator('[data-task-rail-card-kind="notifications"]')).toContainText(
    "Notifications"
  );
  await expect(taskRail.locator('[data-task-rail-card-kind="results"]')).toContainText("Results");
  await expect(page.getByLabel("Expanded task drawer")).toHaveAttribute(
    "data-task-drawer-expanded",
    "obligations"
  );

  await taskRail.locator('[data-task-rail-card-kind="notifications"]').click();
  await expect(taskRail).toHaveAttribute("data-active-drawer", "notifications");
  const guidance = page.getByRole("region", { name: "Player guidance" });
  await expect(guidance).toHaveAttribute("data-guidance-state", "error");
  await expect(guidance).toHaveAttribute("data-guidance-evidence", "available");
  await expect(guidance).toContainText(
    "Preview first; confirmation is separate, and unsafe actions stay blocked."
  );
  await expect(guidance).not.toContainText("Guidance remains under review");
  await expect(guidance).not.toContainText("blockers");
  await expect(guidance).toContainText("Objective");
  await expect(guidance).toContainText("Focus");
  await expect(guidance).toContainText("Action");
  await expect(guidance).toContainText("Safety");
  await expect(guidance).toContainText("Preview before confirming");

  await guidance.getByRole("button", { name: "Collapse guidance" }).click();
  await expect(guidance).toHaveAttribute("data-guidance-collapsed", "true");
  await expect(guidance).not.toContainText("Objective");
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
    .locator('[data-task-rail-card-kind="appointments"]')
    .click();
  await expect(taskRail).toHaveAttribute("data-active-drawer", "appointments");
  await expect(page.getByLabel("Appointment and governance flow")).toHaveAttribute(
    "data-flow-stage",
    "compare-candidates"
  );
  await expect(orientation).toContainText("Preview appointment");
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
  await taskRail.locator('[data-task-rail-card-kind="results"]').click();
  await expect(page.getByLabel("Expanded task drawer")).toContainText(
    "Appointment request prepared."
  );
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
  await page.locator('[data-task-rail-card-kind="notifications"]').click();

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("region", { name: "首屏导向" })).toContainText("宫廷简报");
  await expect(page.locator(".player-guidance-lite")).toContainText("目标");
  await expect(page.locator(".player-guidance-lite")).toContainText("确认前先预览");

  await page.getByLabel("语言").selectOption("en-US");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  await expect(page.getByRole("region", { name: "First screen orientation" })).toContainText(
    "Court Brief"
  );
  await expect(page.locator(".player-guidance-lite")).toContainText("Objective");
  await expect(page.locator(".player-guidance-lite")).toContainText("Preview before confirming");

  await page.getByLabel("Language").selectOption("zh-CN");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator(".player-guidance-lite")).toContainText("焦点");
  await expect(page.locator(".player-guidance-lite")).toContainText("行动");
  await expect(page.getByText("shell.guidanceLite")).toHaveCount(0);
});

test("M7 task rail is first-screen actionable at required desktop viewports", async ({ page }) => {
  const viewports = [
    { width: 1280, height: 720 },
    { width: 1440, height: 900 }
  ];
  const cardKinds = [
    "obligations",
    "appointments",
    "succession",
    "campaign",
    "notifications",
    "results"
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const taskRail = page.getByRole("region", { name: "Task rail" });
    await expect(taskRail).toHaveAttribute("data-task-rail-card-count", "6");
    await expect(taskRail).toHaveAttribute("data-active-drawer", "obligations");
    await expectIntersectsViewport(taskRail);

    for (const kind of cardKinds) {
      await expectIntersectsViewport(taskRail.locator(`[data-task-rail-card-kind="${kind}"]`));
    }

    const activeDrawer = page.getByLabel("Expanded task drawer");
    await expect(activeDrawer).toHaveAttribute("data-task-drawer-expanded", "obligations");
    await expectIntersectsViewport(activeDrawer);
    await expectIntersectsViewport(
      activeDrawer.locator('[data-task-drawer-primary-action="true"]')
    );

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  }
});

test("M7 UX recovery smoke captures first screen, objective, and map screenshots without debug labels", async ({
  page
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("monsoon.client.localePreference.v1", "en-US");
  });

  const evidenceRoot = resolve(process.cwd(), "project/messages/outbox");
  const viewports = [
    {
      label: "desktop",
      viewport: { width: 1440, height: 900 },
      screenshotFile: "M7-UX-RECOVERY-VALIDATION-001__EVIDENCE-1440x900.png"
    },
    {
      label: "smaller",
      viewport: { width: 1280, height: 720 },
      screenshotFile: "M7-UX-RECOVERY-VALIDATION-001__EVIDENCE-1280x720.png"
    }
  ] as const;

  for (const scenario of viewports) {
    await page.setViewportSize(scenario.viewport);
    await page.goto("/");

    const mapCanvas = await expectMountedPixiMapRenderer(page);
    const firstScreen = page.getByRole("region", { name: "First screen orientation" });
    const guidance = page.getByRole("region", { name: "Player guidance" });
    const decisionAssistant = page.getByRole("region", { name: "District decision assistant" });
    const mapRegion = page.locator(".client-shell__map-region");
    const mapSurface = page.locator(".client-shell__map-surface");
    const mapLegend = page.getByLabel("Map legend");
    const taskRail = page.getByRole("region", { name: "Task rail" });
    const taskRailCards = taskRail.locator(".task-rail__cards");

    await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
    await expect(page.locator(".client-shell")).toHaveAttribute("data-debug-mode", "off");
    await expect(page.locator(".client-shell__dev-overlay")).toHaveCount(0);
    await expect(page.getByText("Developer Overlay")).toHaveCount(0);
    await expect(page.getByText("Developer diagnostics")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Monsoon Sovereigns" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Realm Map" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Situation map mode" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(mapSurface).toHaveAttribute("data-map-mode", "situation");
    await expect(mapSurface).toHaveAttribute("data-map-presentation", "soft-strategic-regions");
    await expect(mapSurface).toHaveAttribute("data-player-grid", "hidden");
    await expect(page.locator(".map-viewport")).toHaveAttribute(
      "aria-roledescription",
      "keyboard navigable map read model"
    );
    await expect(mapSurface).toHaveAttribute(
      "data-visible-overlays",
      "selected route obligation settlement"
    );
    await expect(mapLegend).toContainText("Supply path for the selected focus");
    await expect(mapLegend).toContainText("Obligation pressure tied to this focus");
    await expect(mapLegend).not.toContainText("Risk area relevant to the open task");
    await expect(page.getByLabel("Map hover details")).toContainText(
      "Hover a district or settlement for route details."
    );
    await expect(firstScreen).toContainText("Who you are");
    await expect(firstScreen).toContainText("When and where");
    await expect(firstScreen).toContainText("Priority problem");
    await expect(firstScreen).toContainText("Recommended next action");
    await expect(firstScreen).toContainText("You are stewarding");

    await expect(mapCanvas).toHaveAttribute("data-renderer-owner", "map-renderer");
    await expect(mapCanvas).toBeVisible();
    await expectIntersectsViewport(mapRegion);
    await expectIntersectsViewport(firstScreen);
    await expectMeaningfulViewportIntersection(taskRailCards, 24_000);
    await expectMeaningfulViewportIntersection(mapSurface, 110_000);
    await expectMeaningfulViewportIntersection(mapLegend, 8_000);
    await expectNoViewportOverlap(firstScreen, mapSurface);
    await expectNoViewportOverlap(mapSurface, mapLegend);

    await page.screenshot({
      path: resolve(evidenceRoot, scenario.screenshotFile)
    });

    await taskRail.locator('[data-task-rail-card-kind="notifications"]').click();
    await expect(guidance).toHaveAttribute("data-guidance-state", "error");
    await expect(guidance).toContainText("Objective");
    await expect(guidance).toContainText("Focus");
    await expect(guidance).toContainText("Action");
    await expect(guidance).toContainText("Safety");
    await expect(decisionAssistant).toContainText("Current problem");
    await expect(decisionAssistant).toContainText("Recommendation");
    await expect(decisionAssistant).toContainText("Next action");
    await expectNoViewportOverlap(taskRailCards, guidance);
  }
});

test("M7 task rail appointment-error copy hides implementation jargon in English and Chinese", async ({
  page
}) => {
  await page.goto("/?fixture=appointment-error");
  const englishTaskRail = page.getByRole("region", { name: "Task rail" });
  await expect(englishTaskRail.locator('[data-task-rail-card-kind="appointments"]')).toContainText(
    "office eligibility concerns"
  );
  await englishTaskRail.locator('[data-task-rail-card-kind="appointments"]').click();
  const englishText = (await englishTaskRail.textContent()) ?? "";
  expect(englishText).not.toMatch(
    /read model|read-model|GameCommand|command path|raw reason|reason-code|internal jargon/i
  );

  await page.getByLabel("Language").selectOption("zh-CN");
  const chineseTaskRail = page.getByRole("region", { name: "任务栏" });
  await expect(chineseTaskRail.locator('[data-task-rail-card-kind="appointments"]')).toContainText(
    "职位条件疑虑"
  );
  await chineseTaskRail.locator('[data-task-rail-card-kind="appointments"]').click();
  const chineseText = (await chineseTaskRail.textContent()) ?? "";
  expect(chineseText).not.toMatch(/只读模型|GameCommand|命令路径|内部原因码|内部术语|原始原因码/);
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
  await expect(mapCanvas).toHaveAttribute("data-route-source-count", "42");
  await expect(mapCanvas).toHaveAttribute("data-route-policy", "denoised");
  await expect(mapCanvas).toHaveAttribute("data-pan-x", "0.00");
  await expect(mapCanvas).toHaveAttribute("data-hovered-entity", "none");
  await expect(rows).toHaveAttribute("data-row-count", "30");
  await expect(rows).toHaveAttribute("data-rendered-row-count", "16");
  await expect(panel).toHaveAttribute("data-selected-district-id", "1");
  await expect(map).toHaveAttribute("data-selected-district-id", "1");
  await expect(map).toHaveAttribute("data-map-mode", "situation");
  await expect(map).toHaveAttribute("data-map-presentation", "soft-strategic-regions");
  await expect(map).toHaveAttribute("data-player-grid", "hidden");
  await expect(map).toHaveAttribute("data-zoom-level", "1.00");
  await expect(mapCanvas).toHaveAttribute("data-map-mode", "situation");
  const denoisedRouteCount = await readNumberAttribute(mapCanvas, "data-route-count");
  expect(denoisedRouteCount).toBeGreaterThan(0);
  expect(denoisedRouteCount).toBeLessThan(42);

  await page.getByRole("button", { name: "Economy map mode" }).click();
  await expect(map).toHaveAttribute("data-map-mode", "economy");
  await expect(mapCanvas).toHaveAttribute("data-map-mode", "economy");

  await page.getByRole("button", { name: "Routes map mode" }).click();
  await expect(map).toHaveAttribute("data-map-mode", "routes");
  await expect(mapCanvas).toHaveAttribute("data-map-mode", "routes");
  await expect(mapCanvas).toHaveAttribute("data-route-count", "42");
  await expect(mapCanvas).toHaveAttribute("data-route-policy", "complete");

  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(map).toHaveAttribute("data-zoom-level", "1.25");
  await expect(mapCanvas).toHaveAttribute("data-zoom-level", "1.25");

  await page.getByRole("button", { name: "Pan right" }).click();
  await expect(map).toHaveAttribute("data-pan-x", "24.00");
  await expect(mapCanvas).toHaveAttribute("data-pan-x", "24.00");
  await page.getByRole("button", { name: "Reset pan" }).click();
  await expect(map).toHaveAttribute("data-pan-x", "0.00");
  await expect(mapCanvas).toHaveAttribute("data-pan-x", "0.00");
  await expect(map).toHaveAttribute(
    "data-visible-overlays",
    "selected route obligation blocked settlement"
  );
  await expect(page.getByLabel("Map legend")).toContainText("Supply path for the selected focus");
  await expect(page.getByLabel("Map legend")).toContainText(
    "Obligation pressure tied to this focus"
  );
  await expect(page.getByLabel("Map legend")).toContainText("Blocked or strained path");
  await expect(page.getByLabel("Map legend")).not.toContainText(
    "Risk area relevant to the open task"
  );
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
  await expect(panel.getByLabel("District decision assistant")).toContainText("Current problem");
  await expect(panel.getByLabel("District decision assistant")).toContainText("Recommendation");
  await expect(panel.getByLabel("District decision assistant")).toContainText("Next action");
  await expect(panel.getByLabel("Decision data grouped by choice")).toContainText("Resources");
  await expect(panel.getByLabel("Decision data grouped by choice")).toContainText(
    "Route / Campaign"
  );
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
  await expect(panel).toContainText("Decision Assistant");
  await expect(panel).toContainText("Current problem");
  await expect(panel).toContainText("Recommendation");
  await expect(panel).toContainText("Cost");
  await expect(panel).toContainText("Benefit");
  await expect(panel).toContainText("Risk");
  await expect(panel).toContainText("Next action");
  await expect(panel).toContainText("Decision Data");
  await expect(panel).toContainText(
    "Population, labor, stores, obligations, supply route, governance, and campaign planning details stay below the recommendation."
  );
  await expect(panel).not.toContainText("Raw district read-model values");
  await expect(panel).not.toContainText("raw district read-model values");
  await expect(panel).toContainText("Governance");
  await expect(panel).toContainText("Appointment state");
  await expect(panel).toContainText("Effects");
  await expect(panel).toContainText("District actions");
  await expect(panel.locator(".district-panel__decision")).toBeVisible();
  await expect(panel.locator(".district-panel__decision")).not.toContainText(
    "appointment.holder.skill-strong"
  );
  await expect(panel.locator(".district-panel__decision")).not.toContainText(
    "route.season.monsoon-risk"
  );
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
  await expect(page.getByText("m4.campaign.10.outcome")).toHaveCount(0);
  await expect(page.getByText(/\bM[2-7]\b/u)).toHaveCount(0);

  await page.goto("/?fixture=district-error");
  await expect(panel).toContainText("Route is unavailable for this district.");
  await expect(panel.getByLabel("District decision assistant")).toContainText(
    "Review obligations is disabled here; select a reachable district from the map or route queue first."
  );
  await expect(panel.getByLabel("District decision assistant")).not.toContainText(
    "Review obligations and route pressure before committing troops."
  );
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

  await expect(page.getByLabel("Appointment and governance flow")).toHaveCount(0);
  await expect(page.getByLabel("M3 appointment workspace")).toHaveCount(0);
  await expect(page.getByText("office-eligibility-failed")).toHaveCount(0);
  await expect(page.getByText("appointment.local-claimant")).toHaveCount(0);

  await page.locator('[data-task-rail-card-kind="appointments"]').click();
  const flow = page.getByLabel("Appointment and governance flow");
  await expect(flow).toHaveAttribute("data-debug-raw-reasons", "hidden");
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
  await expect(page.getByLabel("Appointment result feedback")).toContainText("Accepted");
  await expect(page.getByLabel("Appointment result feedback")).toContainText(
    "Appointment request prepared."
  );
  await expect(page.getByLabel("Appointment result feedback")).toContainText(
    "same formal order used by the court systems"
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
  await page.locator('[data-task-rail-card-kind="appointments"]').click();

  const flow = page.getByLabel("任命与治理流程");
  await expect(flow).toHaveAttribute("data-selected-candidate-status", "rejected");
  await expect(page.getByLabel("候选人比较")).toContainText("被拒绝");
  await expect(page.getByLabel("候选人比较")).toContainText("不符合职位条件");
  await flow.getByRole("button", { name: "预览任命" }).click();
  await expect(flow).toHaveAttribute("data-flow-stage", "preview");
  await expect(page.getByLabel("任命影响预览")).toContainText("暂时不能确认任命");
  await expect(flow.getByRole("button", { name: "已阻止" })).toBeDisabled();
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
    "Carried supply exceeds the route bottleneck"
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

  await page.getByRole("button", { name: "Situation map mode" }).focus();
  await expect(page.getByRole("button", { name: "Situation map mode" })).toBeFocused();
  await page.keyboard.press("Tab");
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
  await expect(page.getByLabel("M7 supported locale matrix")).toContainText("en-US");
  await expect(page.getByLabel("M7 asset reference manifest")).toContainText(
    "audio.ui.risk-warning"
  );
  await expect(page.getByLabel("M7 localization checks")).toContainText("loc.content-record.keys");
  await expect(page.getByLabel("M7 viewport smoke coverage")).toContainText("viewport.1280x720");
  await expect(page.getByLabel("M7 viewport smoke coverage")).toContainText(
    "viewport.16x10-text-scale"
  );
  await expect(page.getByLabel("M7 viewport smoke coverage")).toContainText("viewport.high-dpi");
  await expect(page.getByLabel("M7 viewport smoke coverage")).toContainText("viewport.ultrawide");
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
    await page.locator('[data-task-rail-card-kind="appointments"]').click();
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

test("M7 platform matrix fixture records supported browser, resolution, locale, and unsupported rows explicitly", async () => {
  expect(platformMatrix.matrixId).toBe("M7-PLATFORM-RESOLUTION-LOCALIZATION-MATRIX-001");

  expect(platformMatrix.supportedExecutionRows).toHaveLength(2);
  expect(platformMatrix.supportedExecutionRows[0]?.axis).toBe("browser");
  expect(platformMatrix.supportedExecutionRows[0]?.label).toBe("Chrome");
  expect(platformMatrix.supportedExecutionRows[0]?.status).toBe("pass");
  expect(platformMatrix.supportedExecutionRows[0]?.evidence).toBe("pnpm test:e2e");
  expect(platformMatrix.supportedExecutionRows[1]?.axis).toBe("desktop");
  expect(platformMatrix.supportedExecutionRows[1]?.label).toBe("Windows desktop smoke");
  expect(platformMatrix.supportedExecutionRows[1]?.status).toBe("pass");
  expect(platformMatrix.supportedExecutionRows[1]?.evidence).toEqual([
    "pnpm desktop:security-check",
    "pnpm desktop:package"
  ]);

  expect(platformMatrix.supportedResolutions).toHaveLength(4);
  expect(platformMatrix.supportedResolutions.map((row) => row.smokeId)).toEqual([
    "viewport.1280x720",
    "viewport.16x10-text-scale",
    "viewport.high-dpi",
    "viewport.ultrawide"
  ]);
  expect(platformMatrix.supportedResolutions.map((row) => `${row.width}x${row.height}`)).toEqual([
    "1280x720",
    "1280x800",
    "1920x1080",
    "2560x1080"
  ]);
  expect(platformMatrix.supportedResolutions.every((row) => row.status === "pass")).toBe(true);

  expect(platformMatrix.supportedLocales).toHaveLength(3);
  expect(platformMatrix.supportedLocales.map((row) => row.localePreference)).toEqual([
    "system",
    "en-US",
    "zh-CN"
  ]);
  expect(platformMatrix.supportedLocales.map((row) => row.expectedLang)).toEqual([
    "zh-CN",
    "en-US",
    "zh-CN"
  ]);
  expect(platformMatrix.supportedLocales.every((row) => row.status === "pass")).toBe(true);

  expect(platformMatrix.unsupportedRows.map((row) => row.label)).toEqual([
    "Edge",
    "Firefox",
    "Windows DPI 150%"
  ]);
  expect(platformMatrix.unsupportedRows.map((row) => row.status)).toEqual([
    "blocked-by-tooling",
    "blocked-by-tooling",
    "follow-up"
  ]);
  expect(platformMatrix.surfaceCoverage).toEqual([
    "tutorial",
    "hints",
    "encyclopedia",
    "map",
    "major command flows",
    "save/load surface",
    "terminal/evidence views"
  ]);
});

test("M7 UI regression matrix stays localized, console-clean, and key-free across supported viewports", async ({
  browser
}, testInfo) => {
  const scenarios = platformMatrix.supportedScenarios;

  for (const scenario of scenarios) {
    const consoleErrors: string[] = [];
    const context = await browser.newContext({
      viewport: scenario.viewport,
      baseURL: testInfo.project.use.baseURL
    });

    try {
      await context.addInitScript(
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

      const scenarioPage = await context.newPage();

      scenarioPage.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });
      scenarioPage.on("pageerror", (error) => {
        consoleErrors.push(error.message);
      });

      await scenarioPage.goto("/");

      await expect(scenarioPage.locator("html")).toHaveAttribute("lang", scenario.expectedLang);
      await expect(scenarioPage.locator(".client-shell__map-surface")).toHaveAttribute(
        "data-district-count",
        "30"
      );
      await expect(scenarioPage.locator(".client-shell__map-surface")).toHaveAttribute(
        "data-settlement-count",
        "10"
      );
      await expect(scenarioPage.locator(".client-shell__dev-overlay")).toHaveCount(0);
      await expect(scenarioPage.getByText("M2 prototype map ready")).toHaveCount(0);
      await expect(scenarioPage.getByText("Prototype District 001")).toHaveCount(0);
      await expect(scenarioPage.getByText("state hash")).toHaveCount(0);

      const visibleText = await scenarioPage.locator("body").innerText();
      expectNoRawPlayerKeys(visibleText);
      expect(visibleText).not.toContain("placeholder-only");
      expect(visibleText).not.toContain("prototype-only");

      if (scenario.localePreference === "system") {
        const languageSelect = scenarioPage.getByLabel(/^(Language|语言)$/u);
        await expect(languageSelect).toHaveValue("system");
        await languageSelect.selectOption("en-US");
        await expect(scenarioPage.locator("html")).toHaveAttribute("lang", "en-US");
        await languageSelect.selectOption("zh-CN");
        await expect(scenarioPage.locator("html")).toHaveAttribute("lang", "zh-CN");
        await expect(
          await scenarioPage.evaluate(() =>
            window.localStorage.getItem("monsoon.client.localePreference.v1")
          )
        ).toBe("zh-CN");
      }

      const overflow = await scenarioPage.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
      expect(consoleErrors).toEqual([]);
    } finally {
      await context.close();
    }
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

function readPlatformMatrixFixture(): PlatformMatrixFixture {
  const fixturePath = resolve(
    process.cwd(),
    "tests/e2e/m7-platform-resolution-localization.matrix.json"
  );
  return JSON.parse(readFileSync(fixturePath, "utf8")) as PlatformMatrixFixture;
}
