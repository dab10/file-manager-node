import os from 'node:os';
import { parseArg } from "./cli/args.js";
import { up } from "./fs/up.js";
import { cd } from './fs/cd.js';

let currentPath = os.homedir();
const username = parseArg();
process.stdout.write(`You are currently in ${currentPath}\n`);

const echoInput = async (chunk) => {
  const chunkStringified = chunk.toString().trim();

  if (chunkStringified === '.exit') {
    process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
  }
  if (chunkStringified === 'up') {
    currentPath = up(currentPath);
    process.stdout.write('\n');
  }

  if (chunkStringified.startsWith('cd ')) {
    // console.log('11111\n')
    // currentPath = cd(currentPath, chunkStringified) + '\n';
    currentPath = await cd(currentPath, chunkStringified);
    process.stdout.write('\n');
  }
  process.stdout.write(`You are currently in ${currentPath}\n`);

  // process.stdout.write(`Received from master process: ${chunk.toString()}\n`)
};

process.stdin.on('data', echoInput);

process.on('SIGINT', () => {
  process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`); 
  process.exit();
});
// console.table([{name: 'Kek', name1: 'Kek1'}, {name: 'Kek2', name1: 'Kek3'}]);