import fs from "fs/promises";
import path from 'node:path';

const pathExists = (path) =>
  fs.stat(path).then(
    () => true,
    () => false
  );

export const cd = async (prevPath, chunkStringified) => {
  let inputPath = chunkStringified.slice(3);

  if (inputPath.includes(' ') && !inputPath.includes('\"')) {
    process.stdout.write(`Invalid input\n`);
    return prevPath
  } 

  if (inputPath.includes('*') || inputPath.includes('?') || inputPath.includes('<') || inputPath.includes('>') || inputPath.includes('|')) {
    process.stdout.write(`Invalid input\n`);
    return prevPath
  } 

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
  
  if (/^[A-Za-z]:{1}/.test(inputPath)) {
    if (inputPath.length === 3 && inputPath[inputPath.length - 1] === '.') inputPath = inputPath.slice(0, -1) + `${path.sep}`
      if (await pathExists(path.join(inputPath))) {
        return inputPath;
      } else {
        process.stdout.write(`Operation failed\n`);
        return prevPath;
      }
  }

  if (await pathExists(path.join(prevPath, inputPath))) {
    return path.join(prevPath, inputPath);
  } else {
    process.stdout.write(`Operation failed\n`);
    return prevPath;
  }
}