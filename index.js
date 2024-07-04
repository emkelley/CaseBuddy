import { confirm } from "@inquirer/prompts";
import { processInventory } from "./inventory.js";

console.clear();

const answer = await confirm({
  message:
    "Before we begin, please confirm that you have read the instructions and completed the prerequesites in the README.md file.",
  default: false,
});

if (!answer) process.exit(0);

const { success, error } = await processInventory();

console.log(success ? "Finished!" : error);
