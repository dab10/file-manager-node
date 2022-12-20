import path from 'node:path';
import { rename as renameFile, readFile, access, constants } from 'node:fs/promises';
import { parsePathArgs } from '../utils/parsePathArgs.js';
import { cd } from './cd.js';

export const rn = async (currentPath, query) => {

  const inputPath = path.normalize(query.slice(3));
  const { firstArg, secondArg } = parsePathArgs(inputPath);

  if (firstArg && secondArg) {
    try {
      let isAccessNewFile = false;
      let newFile;

      const secondArgWithoutMarks = secondArg.split('"').join('');
      const previousFile = await cd(currentPath, 'cd ' + firstArg, false);

      if (previousFile[previousFile.length - 1] === path.sep) {
        previousFile = previousFile.slice(0, -1);
        newFile = path.join(previousFile.slice(0, previousFile.lastIndexOf(path.sep)), secondArgWithoutMarks.trim());
      } else {
        newFile = path.join(previousFile.slice(0, previousFile.lastIndexOf(path.sep)), secondArgWithoutMarks.trim());
      }

      await readFile(previousFile);
  
      try {
        await access(newFile, constants.R_OK | constants.W_OK);
        isAccessNewFile = true;
        process.stdout.write('Operation failed\n');
      } catch {
        if (!isAccessNewFile) await renameFile(previousFile, newFile);
        if (isAccessNewFile) process.stdout.write('Operation failed\n');
      }
    } catch {
      process.stdout.write('Operation failed\n');
    }
  } else {
    process.stdout.write(`Invalid input\n`);
  }
};
