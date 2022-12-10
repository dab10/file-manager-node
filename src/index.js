import os from 'node:os';
import { parseArg } from "./cli/args.js";
import { up } from "./fs/up.js";

let currentPath = os.homedir();
const username = parseArg();
process.stdout.write(`You are currently in ${currentPath}\n`);

const echoInput = (chunk) => {
  const chunkStringified = chunk.toString().trim();

  if (chunkStringified === '.exit') {
    process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
  }
  if (chunkStringified === 'up') {
    currentPath = up(currentPath) + '\n';
  }
  process.stdout.write(`You are currently in ${currentPath}`);
  // process.stdout.write(`Received from master process: ${chunk.toString()}\n`)
};

process.stdin.on('data', echoInput);

process.on('SIGINT', () => {
  process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`); 
  process.exit();
});
// console.table([{name: 'Kek', name1: 'Kek1'}, {name: 'Kek2', name1: 'Kek3'}]);