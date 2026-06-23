import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { desktopBridgeName, desktopIpcChannels } from "@monsoon/platform";

const desktopRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const securityModuleUrl = pathToFileURL(resolve(desktopRoot, "dist", "main", "security.js"));
const { browserWindowSecurityPreferences, contentSecurityPolicy, isTrustedAppFileUrl } =
  await import(securityModuleUrl.href);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(
  browserWindowSecurityPreferences.nodeIntegration === false,
  "BrowserWindow must disable nodeIntegration."
);
assert(
  browserWindowSecurityPreferences.contextIsolation === true,
  "BrowserWindow must enable contextIsolation."
);
assert(browserWindowSecurityPreferences.sandbox === true, "BrowserWindow must enable sandbox.");
assert(
  browserWindowSecurityPreferences.webSecurity === true,
  "BrowserWindow must keep webSecurity enabled."
);
assert(
  browserWindowSecurityPreferences.allowRunningInsecureContent === false,
  "BrowserWindow must reject insecure mixed content."
);
assert(contentSecurityPolicy.includes("default-src 'self'"), "CSP must default to self.");
assert(contentSecurityPolicy.includes("object-src 'none'"), "CSP must disable objects.");

const preloadText = await readFile(resolve(desktopRoot, "dist", "preload", "preload.cjs"), "utf8");
assert(
  preloadText.includes("contextBridge.exposeInMainWorld"),
  "Preload must expose an isolated context bridge."
);
assert(preloadText.includes(desktopBridgeName), "Preload must expose the named desktop bridge.");
assert(
  !preloadText.includes('exposeInMainWorld("ipcRenderer"'),
  "Preload must not expose ipcRenderer."
);
assert(
  !preloadText.includes("exposeInMainWorld('ipcRenderer'"),
  "Preload must not expose ipcRenderer."
);

const allowedChannels = new Set(Object.values(desktopIpcChannels));
assert(allowedChannels.size === 2, "Desktop IPC channel set must stay narrow.");
assert(
  allowedChannels.has("desktop:getRuntimeInfo") && allowedChannels.has("desktop:setFullscreen"),
  "Desktop IPC channels changed without security-check update."
);

const rendererText = await readFile(
  resolve(desktopRoot, "dist", "renderer", "renderer.js"),
  "utf8"
);
assert(!rendererText.includes("require("), "Renderer must not call require.");
assert(!rendererText.includes("ipcRenderer"), "Renderer must not reference ipcRenderer.");

const rendererRoot = resolve(desktopRoot, "dist", "renderer");
const rendererIndexUrl = pathToFileURL(resolve(rendererRoot, "index.html")).href;
const mainProcessUrl = pathToFileURL(resolve(desktopRoot, "dist", "main", "main.js")).href;
assert(isTrustedAppFileUrl(rendererIndexUrl, rendererRoot), "Renderer entry file must be trusted.");
assert(
  !isTrustedAppFileUrl(mainProcessUrl, rendererRoot),
  "Desktop shell must not trust file URLs outside the renderer root."
);

console.log("Electron security preferences passed.");
console.log("Preload exposes only the named monsoonDesktop bridge.");
console.log("Renderer file navigation is restricted to the packaged renderer root.");
console.log(`Allowed IPC channels: ${Array.from(allowedChannels).join(", ")}`);
