import { argv, exit, stdout } from "node:process";

const [, , packageName = "unknown", command = "check"] = argv;

stdout.write(`hello ${packageName} ${command}\n`);
exit(0);
