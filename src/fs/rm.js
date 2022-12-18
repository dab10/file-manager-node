import fs from "fs/promises";
import { cd } from './cd.js';

export const rm = async (currentPath, query) => {
  
  const inputPath = await cd(currentPath, query, false);

  try {
    const inputPathCheck = await fs.lstat(inputPath);
    if (inputPathCheck.isFile()) {

      await fs.unlink(inputPath);

    } else {
      return process.stdout.write('Operation failed\n');
    }
  } catch {
    return process.stdout.write('Operation failed\n');
  }
};
