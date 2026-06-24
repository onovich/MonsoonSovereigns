import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, test } from "vitest";

const execFileAsync = promisify(execFile);

describe("authority randomness architecture guard", () => {
  test("self-test fixture proves Math.random is rejected in authoritative sim-core paths", async () => {
    const result = await execFileAsync("node", [
      "tools/architecture/check-boundaries.mjs",
      "--self-test-only"
    ]);

    expect(result.stdout).toContain("Math.random");
  });
});
