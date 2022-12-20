import fs from "fs/promises";
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';
import { cd } from './cd.js';


function outputWithoutStopPipe() {
  return new Writable (
    {
      decodeStrings: false,
      write(chunk, encoding, callback) {
        process.stdout.write(chunk, callback);
      }
    }
  )
}

export const cat = async (currentPath, chunkStringified) => {
  
  const inputPath = await cd(currentPath, chunkStringified.slice(1), false);
  const readable = createReadStream(inputPath, 'utf-8')
  try {
    const inputPathCheck = await fs.lstat(inputPath);
    if (inputPathCheck.isFile()) {

      await pipeline(readable, outputWithoutStopPipe());

    } else {
      return process.stdout.write('Operation failed\n');
    }
  } catch {
    return process.stdout.write('Operation failed\n');
  }
};
