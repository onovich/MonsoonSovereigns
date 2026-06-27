import { exit, stdout } from "node:process";

import { runM6BatchBalanceV1, validateM6BatchBalanceArtifactV1 } from "./m6-batch-balance.ts";

const artifact = runM6BatchBalanceV1();
const validation = validateM6BatchBalanceArtifactV1(artifact);

if (!validation.ok) {
  stdout.write("M6 batch balance artifact validation failed.\n");
  for (const reason of validation.reasons) {
    stdout.write(`- ${reason}\n`);
  }
  exit(1);
}

stdout.write(`${JSON.stringify(artifact, null, 2)}\n`);
