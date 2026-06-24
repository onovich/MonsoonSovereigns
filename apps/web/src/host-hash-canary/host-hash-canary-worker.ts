import { computeM2HostHashCanaryHashes } from "./compute-host-hash-canary";

interface HostHashCanaryWorkerResult {
  readonly status: "ok";
  readonly hashes: ReturnType<typeof computeM2HostHashCanaryHashes>;
}

interface HostHashCanaryWorkerScope {
  readonly postMessage: (message: HostHashCanaryWorkerResult) => void;
}

const workerScope = globalThis as typeof globalThis & HostHashCanaryWorkerScope;

workerScope.postMessage({
  status: "ok",
  hashes: computeM2HostHashCanaryHashes()
} satisfies HostHashCanaryWorkerResult);
