import { cp } from "./cp.js";
import fs from "fs/promises";
import { cd } from "./cd.js";
import path from 'node:path';
import { parsePathArgs } from "../utils/parsePathArgs.js";

export const mv = async (currentPath, query) => {
  const inputPath = path.normalize(query.slice(3));
  const { firstArg } = parsePathArgs(inputPath);

  try {
    const destinationFile = await cp(currentPath, query);

    if (!destinationFile) {
      const inputPath = await cd(currentPath, 'cd ' + firstArg, false);
      await fs.unlink(inputPath);
    } 
  } catch  {
    process.stdout.write('Operation failed\n');
  }
}