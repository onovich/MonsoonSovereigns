import { exit, stdout } from "node:process";

import {
  runM7LargeScaleBalanceV1,
  validateM7LargeScaleBalanceArtifactV1
} from "./m7-large-scale-balance.ts";

const artifact = runM7LargeScaleBalanceV1();
const validation = validateM7LargeScaleBalanceArtifactV1(artifact);

if (!validation.ok) {
  stdout.write("M7 large-scale balance artifact validation failed.\n");
  for (const reason of validation.reasons) {
    stdout.write(`- ${reason}\n`);
  }
  exit(1);
}

stdout.write(`${JSON.stringify(artifact, null, 2)}\n`);
