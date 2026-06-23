import type { WebPreferences } from "electron";
import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const browserWindowSecurityPreferences = {
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: true,
  webSecurity: true,
  allowRunningInsecureContent: false,
  experimentalFeatures: false
} as const satisfies WebPreferences;

export const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'"
].join("; ");

export function isTrustedAppFileUrl(value: string, trustedRootPath: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "file:") {
      return false;
    }

    const trustedRoot = resolve(trustedRootPath);
    const targetPath = resolve(fileURLToPath(parsed));
    const relativePath = relative(trustedRoot, targetPath);

    return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
  } catch {
    return false;
  }
}
