import * as path from 'path';
import { writeFile } from 'node:fs/promises';

export const add = async (currentPath, query) => {
  try {
    const fileName = query.slice(4);

    const promise = writeFile(path.join(currentPath, fileName), '');
    await promise;
  } catch (err) {
    process.stdout.write('Operation failed\n');
  }
};