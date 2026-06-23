import { app, BrowserWindow, ipcMain, session } from "electron";
import type { OnHeadersReceivedListenerDetails } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createLocaleId,
  desktopIpcChannels,
  isSetFullscreenRequest,
  type DesktopRuntimeInfo
} from "@monsoon/platform";
import {
  browserWindowSecurityPreferences,
  contentSecurityPolicy,
  isTrustedAppFileUrl
} from "./security.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rendererRoot = join(currentDir, "../renderer");

function applyContentSecurityPolicy(): void {
  session.defaultSession.webRequest.onHeadersReceived(
    (details: OnHeadersReceivedListenerDetails, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [contentSecurityPolicy]
        }
      });
    }
  );
}

function createRuntimeInfo(): DesktopRuntimeInfo {
  const platform =
    process.platform === "win32" || process.platform === "darwin" || process.platform === "linux"
      ? process.platform
      : "unknown";

  return {
    platform,
    appVersion: app.getVersion(),
    locale: createLocaleId(app.getLocale())
  };
}

function registerIpcHandlers(): void {
  ipcMain.handle(desktopIpcChannels.getRuntimeInfo, () => createRuntimeInfo());

  ipcMain.handle(desktopIpcChannels.setFullscreen, (event, request: unknown) => {
    if (!isSetFullscreenRequest(request)) {
      throw new Error("Invalid setFullscreen request.");
    }

    BrowserWindow.fromWebContents(event.sender)?.setFullScreen(request.enabled);
  });
}

function createMainWindow(): BrowserWindow {
  const preload = join(currentDir, "../preload/preload.cjs");
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    show: false,
    backgroundColor: "#111111",
    webPreferences: {
      ...browserWindowSecurityPreferences,
      preload
    }
  });

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (!isTrustedAppFileUrl(url, rendererRoot)) {
      event.preventDefault();
    }
  });

  window.once("ready-to-show", () => {
    window.show();
  });

  void window.loadFile(join(rendererRoot, "index.html"));
  return window;
}

app.on("web-contents-created", (_event, contents) => {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});

app.whenReady().then(() => {
  applyContentSecurityPolicy();
  registerIpcHandlers();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
