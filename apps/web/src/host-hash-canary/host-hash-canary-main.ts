import type { HostHashCanaryHashes } from "./compute-host-hash-canary";

interface HostHashCanaryWorkerResult {
  readonly status: "ok";
  readonly hashes: HostHashCanaryHashes;
}

declare global {
  interface Window {
    __monsoonHostHashCanaryResult?: HostHashCanaryWorkerResult;
  }
}

const statusElement = document.getElementById("status");
const resultElement = document.getElementById("result");

function renderStatus(message: string): void {
  if (statusElement !== null) {
    statusElement.textContent = message;
  }
}

function renderResult(result: HostHashCanaryWorkerResult): void {
  if (resultElement !== null) {
    resultElement.textContent = JSON.stringify(result.hashes, null, 2);
  }

  document.body.setAttribute("data-canary-status", result.status);
  window.__monsoonHostHashCanaryResult = result;
}

function renderFailure(message: string): void {
  document.body.setAttribute("data-canary-status", "failed");
  if (resultElement !== null) {
    resultElement.textContent = message;
  }
}

renderStatus("Starting dedicated worker...");

const worker = new Worker(new URL("./host-hash-canary-worker.ts", import.meta.url), {
  type: "module"
});

worker.addEventListener("message", (event: MessageEvent<HostHashCanaryWorkerResult>) => {
  if (event.data.status !== "ok") {
    renderFailure("Dedicated worker returned an unexpected status.");
    worker.terminate();
    return;
  }

  renderResult(event.data);
  renderStatus("Dedicated worker canary complete.");
  worker.terminate();
});

worker.addEventListener("error", (event) => {
  renderFailure(`Dedicated worker failed: ${event.message}`);
});
