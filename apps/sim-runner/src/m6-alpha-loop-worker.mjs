import { parentPort } from "node:worker_threads";

import { runM6AlphaStartToVictoryLoopV1 } from "@monsoon/sim-core";

if (parentPort === null) {
  throw new Error("M6 Alpha loop worker requires a parentPort.");
}

parentPort.on("message", (message) => {
  try {
    if (typeof message !== "string") {
      throw new Error("M6 worker message must be a JSON string.");
    }
    const request = JSON.parse(message);
    if (
      request === null ||
      typeof request !== "object" ||
      Array.isArray(request) ||
      request.kind !== "run-m6-alpha-loop-v1"
    ) {
      throw new Error("M6 worker message kind is invalid.");
    }

    const result = runM6AlphaStartToVictoryLoopV1(request.script);
    parentPort?.postMessage(JSON.stringify({ status: "ok", result }));
  } catch (error) {
    parentPort?.postMessage(
      JSON.stringify({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown M6 worker error."
      })
    );
  }
});
