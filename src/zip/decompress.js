import fs from "fs/promises";
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'stream/promises';
import { createBrotliDecompress } from 'node:zlib';
import { parsePathArgs } from "../utils/parsePathArgs.js";
import { cd } from "../fs/cd.js";

const pathExists = (path) =>
  fs.stat(path).then(
    () => true,
    () => false
  );

export const decompress = async (currentPath, query) => {
  const inputPath = path.normalize(query.slice(11));
  const { firstArg, secondArg } = parsePathArgs(inputPath);

  if (firstArg && secondArg) {

    let firstArgNormalize = path.normalize(firstArg);
    let secondArgNormalize = path.normalize(secondArg);
    const { ext: extFirstArg } = path.parse(firstArgNormalize);
    const { dir: dirSecondArg, base: baseSecondArg } = path.parse(secondArgNormalize);

    if (extFirstArg !== '.br') {
      return process.stdout.write('Invalid input\n111');
    }

    const inputPathForRead = await cd(currentPath, 'cd ' + firstArgNormalize, false);
    const inputPathForWriteWithoutFilename = await cd(currentPath, 'cd ' + dirSecondArg, false);
    
    let inputPathForWrite = path.join(inputPathForWriteWithoutFilename, baseSecondArg);

    try {
      const data = await fs.lstat(inputPathForRead);
      if (!data.isFile()) {
        return process.stdout.write('Operation failed\n222');
      }
    } catch {
      return process.stdout.write('Operation failed\n333');
    }

    if (currentPath === inputPathForWriteWithoutFilename && 
      (dirSecondArg.length === 0 ? false : currentPath.slice(currentPath.lastIndexOf(path.sep)) !== dirSecondArg.slice(dirSecondArg.lastIndexOf(path.sep)))) {
      return process.stdout.write('Operation failed\n444');
    }

    if (await pathExists(inputPathForWrite)) {
      return process.stdout.write('Operation failed\n555');
    } else {
      const readable = createReadStream(inputPathForRead);
      const decompressBrotli = createBrotliDecompress();
      const writeable = createWriteStream(inputPathForWrite);

      try {
        await pipeline(readable, decompressBrotli, writeable);
      } catch (err) {
        console.log(err)
        return process.stdout.write('Operation failed\n666');
      } 
    }
  } else {
    return process.stdout.write(`Invalid input\n777`);
  }
};