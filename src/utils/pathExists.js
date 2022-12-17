import fs from "fs/promises";

export const pathExists = (path) =>
  fs.stat(path).then(
    () => true,
    () => false
  );