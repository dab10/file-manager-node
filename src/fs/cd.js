import fs from "fs/promises";
import path from 'node:path';
import { chdir } from "process";

const pathExists = (path) =>
  fs.stat(path).then(
    () => true,
    () => false
  );

export const cd = async (prevPath, chunkStringified, isDirectoryCheck) => {
  let inputPath = chunkStringified.slice(3);

  if (inputPath.includes(' ') && !inputPath.includes('\"')) {
    process.stdout.write(`Invalid input\n`);
    return prevPath
  } 

  if (inputPath.includes('*') || inputPath.includes('?') || inputPath.includes('<') || inputPath.includes('>') || inputPath.includes('|')) {
    process.stdout.write(`Invalid input\n`);
    return prevPath
  } 

  let inputPathCheck = false;
  let countDoubleMarks = 0;
  let isDoubleMarksInDiskName = false;
  let isInvalidPath = false;
  let inputPathNormalize = path.normalize(inputPath);

  const inputPathRes = inputPathNormalize.split(`${path.sep}`).map((item, index) => {
    if (index === 0) {
      if (item[0] === '\"') { 
        countDoubleMarks++;
        item = item.slice(1)
      }
      if (item[item.length - 1] === '\"') { 
        countDoubleMarks++;
        item = item.slice(0, -1)
      }
      if (/^[A-Za-z]:{1}/.test(item) && countDoubleMarks > 0) {
        countDoubleMarks = 0;
        isDoubleMarksInDiskName = true;
      }
      return item;
    } else {
      if (item[0] === '\"') { 
        countDoubleMarks++;
        item = item.slice(1)
      }
      if (item[item.length - 1] === '\"') { 
        countDoubleMarks++;
        item = item.slice(0, -1)
      }
      return item;
    } 
  }).join(path.sep);
  if (countDoubleMarks % 2 === 1 || isDoubleMarksInDiskName || isInvalidPath) {
    process.stdout.write(`Invalid input\n`);
    return prevPath;
  }
  inputPath = inputPathRes;


  if (path.normalize(inputPath) === path.sep) {
    return prevPath.slice(0, 3);
  }

 
  if (isDirectoryCheck) {
    if (/^[A-Za-z]:{1}/.test(inputPath)) {
      if (inputPath.length === 3 && inputPath[inputPath.length - 1] === '.') inputPath = inputPath.slice(0, -1) + `${path.sep}`
        // if (await pathExists(path.join(inputPath))) {
        //   return inputPath;
        // } else {
        //   process.stdout.write(`Operation failed\n`);
        //   return prevPath;
        // }
        try {
          console.log('chDirExitFirst', inputPath);
          chdir(inputPath);
          return inputPath;
        } catch (err) {
          process.stdout.write(`Operation failedFirst\n`);
          return prevPath;
        }
    }

    try {
      console.log('chDirExitSecond', path.join(prevPath, inputPath));
      chdir(path.join(prevPath, inputPath));
      return path.join(prevPath, inputPath);
    } catch (err) {
      process.stdout.write(`Operation failedSecond\n`);
      return prevPath;
    }
  }

  // if (isDirectoryCheck) {
  //   try {

  //     inputPathCheck = await fs.lstat(path.join(prevPath, inputPath));
  //   } catch {
  //     process.stdout.write(`Operation failed\n`);
  //     return prevPath;
  //   }

  //   if (/^[A-Za-z]:{1}/.test(inputPath)) {
  //     if (inputPath.length === 3 && inputPath[inputPath.length - 1] === '.') inputPath = inputPath.slice(0, -1) + `${path.sep}`
  //       if (await pathExists(path.join(inputPath))) {
  //         return inputPath;
  //       } else {
  //         process.stdout.write(`Operation failed\n`);
  //         return prevPath;
  //       }
  //   }

  //   if (await pathExists(path.join(prevPath, inputPath)) && inputPathCheck.isDirectory()) {
  //     return path.join(prevPath, inputPath);
  //   } else {
  //     process.stdout.write(`Operation failed\n`);
  //     return prevPath;
  //   }
  // }

  if (!isDirectoryCheck) {
    if (/^[A-Za-z]:{1}/.test(inputPath)) {
      if (inputPath.length === 3 && inputPath[inputPath.length - 1] === '.') inputPath = inputPath.slice(0, -1) + `${path.sep}`
        if (await pathExists(path.join(inputPath))) {
          return inputPath;
        } else {
          return prevPath;
        }
    }

    if (await pathExists(path.join(prevPath, inputPath))) {
      return path.join(prevPath, inputPath);
    } else {
      return prevPath;
    }
  }

}