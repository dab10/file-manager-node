import * as path from 'path';
import { writeFile } from 'node:fs/promises';

export const add = async (currentPath, query) => {

  let fileName = query.slice(4);

  if (fileName.includes(' ') && !fileName.includes('\"')) {
    process.stdout.write(`Invalid input\n`);
    return currentPath;
  } 

  if (fileName.includes('*') || fileName.includes('?') || fileName.includes('<') || fileName.includes('>') || fileName.includes('|') || fileName.includes('\/') || fileName.includes('\\')) {
    process.stdout.write(`Invalid input\n`);
    return currentPath
  } 

  let countDoubleMarks = 0;

  if (fileName[0] === '\"') { 
    countDoubleMarks++;
    fileName = fileName.slice(1)
  }
  if (fileName[fileName.length - 1] === '\"') { 
    countDoubleMarks++;
    fileName = fileName.slice(0, -1)
  }

  if (countDoubleMarks % 2 === 1) {
    process.stdout.write(`Invalid input\n`);
    return currentPath;
  }

  try {
    const promise = writeFile(path.join(currentPath, fileName), '', { flag: 'wx' });
    await promise;
    
  } catch {
    process.stdout.write('Operation failed\n');
  }
};