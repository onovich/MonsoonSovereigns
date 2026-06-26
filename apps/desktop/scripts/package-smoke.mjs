import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { _electron } from "@playwright/test";

const desktopPackageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../..",
  ".tmp",
  "desktop-package",
  "MonsoonSovereigns-win32-x64"
);
const packageCanaryPath = resolve(desktopPackageRoot, "renderer", "web", "host-hash-canary.html");

const failures = [];

await access(packageCanaryPath);

const app = await _electron.launch({
  args: [desktopPackageRoot],
  env: {
    ...process.env,
    MONSOON_SMOKE_WEB: "1"
  }
});

try {
  const page = await app.firstWindow();
  await page.waitForLoadState("domcontentloaded");

  const workspace = page.getByLabel("M5 playable slice workspace");
  const startButton = page.getByRole("button", { name: "Start M5 slice" });
  const previewButton = page.getByRole("button", { name: "Preview command" });
  const confirmButton = page.getByRole("button", { name: "Confirm command" });
  const saveButton = page.getByRole("button", { name: "Save checkpoint" });
  const cancelButton = page.getByRole("button", { name: "Cancel slice" });
  const loadButton = page.getByRole("button", { name: "Load checkpoint" });
  const commandPreview = page.getByLabel("M5 command preview");
  const commandStatus = page.getByLabel("M5 command status");
  const saveStatus = page.getByLabel("M5 save status");
  const importExportButtons = page.getByRole("button", { name: /import|export/i });

  await workspace.waitFor({ timeout: 120000 });
  if ((await workspace.count()) === 0) {
    failures.push("M5 playable slice workspace did not mount in packaged app.");
  }

  const hasRuntimeBridge = await page.evaluate(() =>
    Boolean(globalThis.monsoonDesktop?.getRuntimeInfo)
  );
  if (!hasRuntimeBridge) {
    failures.push("monsoonDesktop.getRuntimeInfo bridge was not available in packaged app.");
  }

  const importExportCount = await importExportButtons.count();
  if (importExportCount === 0) {
    console.log("Import/export controls were not discoverable by ARIA role during smoke run.");
  }

  if ((await saveButton.count()) === 0) {
    failures.push("Save checkpoint button was not present for M5 smoke.");
  }
  if ((await loadButton.count()) === 0) {
    failures.push("Load checkpoint button was not present for M5 smoke.");
  }

  await startButton.waitFor({ timeout: 120000 }).catch(() => {
    failures.push("Start M5 slice button was not found.");
  });
  if ((await startButton.count()) > 0) {
    await startButton.click();
    await commandPreview.waitFor({ timeout: 120000 }).catch(() => {
      failures.push("M5 command preview did not render.");
    });

    if ((await workspace.getAttribute("data-phase")) !== "running") {
      failures.push(
        `Expected data-phase to be running after start; got ${String(await workspace.getAttribute("data-phase"))}.`
      );
    }
  }

  if ((await previewButton.count()) > 0) {
    await previewButton.click();
  } else {
    failures.push("Preview command button missing.");
  }
  await expectLocatorAttr(
    commandPreview,
    "data-command-kind",
    "sim.create-campaign-objective",
    "M5 command preview kind"
  );

  if ((await confirmButton.count()) > 0) {
    await confirmButton.click();
  } else {
    failures.push("Confirm command button missing.");
  }
  await expectTextContains(
    commandStatus,
    "sim.create-campaign-objective confirmed for polity:1",
    "M5 command status"
  );

  if ((await saveButton.count()) > 0) {
    await saveButton.click();
  }
  await expectTextContains(saveStatus, "m5.save.client-session-written", "M5 save status");
  if ((await workspace.getAttribute("data-save-present")) !== "true") {
    failures.push("data-save-present flag did not become true after saving checkpoint.");
  }

  if ((await cancelButton.count()) > 0) {
    await cancelButton.click();
    await page.waitForTimeout(250);
  } else {
    failures.push("Cancel slice button missing.");
  }

  if ((await loadButton.count()) > 0) {
    await loadButton.click();
  } else {
    failures.push("Load checkpoint button missing.");
  }
  await expectTextContains(saveStatus, "m5.load.client-session-restored", "M5 load status");

  const phaseAfterLoad = await workspace.getAttribute("data-phase");
  if (phaseAfterLoad !== "running") {
    failures.push(
      `Expected workspace phase to return to running after load; got ${String(phaseAfterLoad)}.`
    );
  }

  console.log(`M5 workspace phase: ${String(await workspace.getAttribute("data-phase"))}`);
  console.log(
    `M5 workspace confirmed count: ${String(await workspace.getAttribute("data-confirmed-count"))}`
  );
  console.log(`Import/export button count: ${importExportCount}`);

  if (failures.length > 0) {
    throw new Error(`M5 desktop package smoke failed ${failures.length} checks.`);
  }

  console.log("M5 desktop packaged smoke: PASS");
} finally {
  await app.close();
  if (failures.length > 0) {
    failures.forEach((failure) => {
      console.error(`[evidence] ${failure}`);
    });
    process.exitCode = 1;
  }
}

async function expectTextContains(locator, expectedText, label) {
  const value = (await locator.textContent()) ?? "";
  if (!value.includes(expectedText)) {
    failures.push(`Expected ${label} to contain "${expectedText}", got "${value}".`);
  }
}

async function expectLocatorAttr(locator, attrName, expectedValue, label) {
  const actualValue = await locator.getAttribute(attrName);
  if (actualValue !== expectedValue) {
    failures.push(
      `Expected ${label} ${attrName}="${expectedValue}", got "${String(actualValue)}".`
    );
  }
}
