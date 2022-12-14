import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rename as renameFile, readFile, access, constants } from 'node:fs/promises';

export const rn = async (currentPath, query) => {
  

  const __dirname = dirname(fileURLToPath(import.meta.url));
  try {
    let isAccessNewFile = false;
    const previousFile = path.join(__dirname, 'files', 'wrongFilename.txt');
    const newFile = path.join(__dirname, 'files', 'properFilename.md');

    await readFile(previousFile);

    try {
      await access(newFile, constants.R_OK | constants.W_OK);
      isAccessNewFile = true;
      throw new Error('FS operation failed');
    } catch (err) {
      if (!isAccessNewFile) await renameFile(previousFile, newFile);
      if (isAccessNewFile) throw new Error('FS operation failed');
    }
  } catch (err) {
    throw new Error('FS operation failed');
  }
};
