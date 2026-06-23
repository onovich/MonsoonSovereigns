import type { DesktopPlatformBridge } from "@monsoon/platform";

declare global {
  interface Window {
    readonly monsoonDesktop: DesktopPlatformBridge;
  }
}

export {};
