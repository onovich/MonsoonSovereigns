// eslint-disable-next-line @typescript-eslint/no-require-imports -- Electron sandbox preloads run as CommonJS.
const electron = require("electron") as typeof import("electron");

type DesktopPlatformBridge = import("@monsoon/platform").DesktopPlatformBridge;

const desktopBridgeName = "monsoonDesktop";
const desktopIpcChannels = {
  getRuntimeInfo: "desktop:getRuntimeInfo",
  setFullscreen: "desktop:setFullscreen"
} as const;

const bridge: DesktopPlatformBridge = Object.freeze({
  getRuntimeInfo: async () =>
    electron.ipcRenderer.invoke(desktopIpcChannels.getRuntimeInfo) as ReturnType<
      DesktopPlatformBridge["getRuntimeInfo"]
    >,
  setFullscreen: async (enabled) => {
    await electron.ipcRenderer.invoke(desktopIpcChannels.setFullscreen, { enabled });
  }
});

electron.contextBridge.exposeInMainWorld(desktopBridgeName, bridge);
