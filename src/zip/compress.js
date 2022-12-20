import fs from "fs/promises";
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress } from 'node:zlib';
import { parsePathArgs } from "../utils/parsePathArgs.js";
import { cd } from "../fs/cd.js";
import { pathExists } from "../utils/pathExists.js";

export const compress = async (currentPath, query) => {
  const inputPath = path.normalize(query.slice(9));
  const { firstArg, secondArg } = parsePathArgs(inputPath);

  if (firstArg && secondArg) {

    let firstArgNormalize = path.normalize(firstArg);
    let secondArgNormalize = path.normalize(secondArg);
    const { dir: dirSecondArg, base: baseSecondArg, ext: extSecondArg } = path.parse(secondArgNormalize);

    if (extSecondArg !== '.br') {
      return process.stdout.write('Invalid input\n');
    }

    const inputPathForRead = await cd(currentPath, 'cd ' + firstArgNormalize, false);
    const inputPathForWriteWithoutFilename = await cd(currentPath, 'cd ' + dirSecondArg, false);
    
    let inputPathForWrite = path.join(inputPathForWriteWithoutFilename, baseSecondArg);

    try {
      const data = await fs.lstat(inputPathForRead);
      if (!data.isFile()) {
        return process.stdout.write('Operation failed\n');
      }
    } catch {
      return process.stdout.write('Operation failed\n');
    }

    if (currentPath === inputPathForWriteWithoutFilename && 
      (dirSecondArg.length === 0 ? false : currentPath.slice(currentPath.lastIndexOf(path.sep)) !== dirSecondArg.slice(dirSecondArg.lastIndexOf(path.sep)))) {
      return process.stdout.write('Operation failed\n');
    }

    if (await pathExists(inputPathForWrite)) {
      return process.stdout.write('Operation failed\n');
    } else {
      const readable = createReadStream(inputPathForRead, 'utf-8');
      const compressBrotli = createBrotliCompress();
      const writeable = createWriteStream(inputPathForWrite, 'utf-8');

      try {
        await pipeline(readable, compressBrotli, writeable);
      } catch {
        return process.stdout.write('Operation failed\n');
      } 
    }
  } else {
    return process.stdout.write(`Invalid input\n`);
  }
};