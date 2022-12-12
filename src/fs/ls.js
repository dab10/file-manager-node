import path from 'node:path';
import { readdir } from 'node:fs/promises';


export const list = async (currentPath) => {

  try {
    let directoriesResult = []
    let filesResult = []

    const allData = await readdir(path.normalize(currentPath), { withFileTypes: true });
    const directories = allData.filter(item => item.isDirectory()).map(item => item.name);
    const files = allData.filter(item => item.isFile()).map(item => item.name);

    for (let i = 0; i < directories.length; i++) {
      directoriesResult.push({ 'Name': directories[i], 'Type': 'directory' })
    }
    for (let i = 0; i < files.length; i++) {
      filesResult.push({ 'Name': files[i], 'Type': 'file' })
    }
    return directoriesResult.concat(filesResult);
  } catch {
    process.stdout.write('Operation failed');
  }
};
