import { readFileSync } from "node:fs";
import { join } from "node:path";
import { useMemo } from "react";

export function renderLeakMarker(): string {
  const frameId = requestAnimationFrame(() => undefined);
  cancelAnimationFrame(frameId);
  const timeoutId = setTimeout(() => undefined, 1);
  clearTimeout(timeoutId);
  const intervalId = setInterval(() => undefined, 1);
  clearInterval(intervalId);

  return `${String(useMemo)}:${readFileSync(join("bad", "path"), "utf8")}:${document.title}:${window.location.href}:${Date.now()}:${performance.now()}:${new Date().toISOString()}:${Math.random()}`;
}
