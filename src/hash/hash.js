import fs from "fs/promises";
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { cd } from '../fs/cd.js';

export const hash = async (currentPath, query) => {
  const { createHash } = await import('node:crypto');
  const inputPath = await cd(currentPath, query.slice(2), false);
  
  try {
    const inputPathCheck = await fs.lstat(inputPath);
    if (inputPathCheck.isFile()) {
      const content = await readFile(inputPath);
      const hash = createHash('sha256');
    
      hash.update(content);
      process.stdout.write(`${hash.digest('hex')}\n`);

    } else {
      return process.stdout.write('Operation failed\n');
    }
  } catch {
    process.stdout.write('Operation failed\n');
  }
};