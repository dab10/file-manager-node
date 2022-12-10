import path from 'node:path';

export const up = (prevPath) => {
  const prevPathArr = prevPath.split(path.sep);
  if (prevPathArr.length > 1) prevPathArr.pop();
  if (prevPathArr.length === 1) {
    const newPath = path.join(...prevPathArr, path.sep);
    return newPath;
  }
  const newPath = path.join(...prevPathArr);
  return newPath;
}
