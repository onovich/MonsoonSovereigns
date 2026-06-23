import fc from "fast-check";
import { expect, test } from "vitest";

import { createBootstrappedShellSnapshot } from "../apps/web/src/shell/create-shell-snapshot";

function stableHash(text: string): string {
  let hash = 0x811c9dc5;

  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

test("bootstrapped shell snapshot is deterministic", () => {
  const first = createBootstrappedShellSnapshot();
  const second = createBootstrappedShellSnapshot();

  expect(first.simulation.stateHash).toBe(second.simulation.stateHash);
  expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  expect(first.panels.metrics.at(-1)?.value).toBe(first.simulation.stateHash);
});

test("stableHash is property-safe for arbitrary strings", () => {
  fc.assert(
    fc.property(fc.string(), (text) => {
      const first = stableHash(text);
      const second = stableHash(text);

      expect(first).toBe(second);
      expect(first).toMatch(/^[0-9a-f]{8}$/);
    })
  );
});
