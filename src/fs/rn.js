import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rename as renameFile, readFile, access, constants } from 'node:fs/promises';
import { parsePathArgs } from '../utils/parsePathArgs.js';
import { cd } from './cd.js';

export const rn = async (currentPath, query) => {

  const inputPath = path.normalize(query.slice(3));
  const { firstArg, secondArg } = parsePathArgs(inputPath);

  if (firstArg && secondArg) {
    console.log(firstArg)
    console.log(secondArg)
    try {
      let isAccessNewFile = false;
      let newFile;
      let newFilePath;
      const secondArgWithoutMarks = secondArg.split('"').join('');
      const previousFile = await cd(currentPath, 'cd ' + firstArg, false);
      console.log(previousFile)

      if (previousFile[previousFile.length - 1] === '\\') {
        previousFile = previousFile.slice(0, -1);
        newFile = path.join(previousFile.slice(0, previousFile.lastIndexOf('\\')), secondArgWithoutMarks.trim());
      } else {
        newFile = path.join(previousFile.slice(0, previousFile.lastIndexOf('\\')), secondArgWithoutMarks.trim());
      }

      console.log(newFile)

      await readFile(previousFile);
  
      try {
        await access(newFile, constants.R_OK | constants.W_OK);
        isAccessNewFile = true;
        process.stdout.write('Operation failed\n1111111111');
      } catch {
        if (!isAccessNewFile) await renameFile(previousFile, newFile);
        if (isAccessNewFile) process.stdout.write('Operation failed\n');
      }
    } catch {
      process.stdout.write('Operation failed\n11111');
    }
  } else {
    process.stdout.write(`Invalid input\n`);
  }
  
  // console.log(firstArg);
  // console.log(secondArg);
  // console.log(isPathCorrect);
  // console.log(inputPath.split('"'));
  // console.log('divideIndex=', divideIndex)
};
