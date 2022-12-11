import os from 'node:os';
import { parseArg } from "./cli/args.js";
import { up } from "./fs/up.js";
import { cd } from './fs/cd.js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';

let currentPath = os.homedir();
const username = parseArg();
const rl = readline.createInterface({ input, output });

rl.setPrompt(`You are currently in ${currentPath}\n\n`);
rl.prompt();

rl.on( 'line' , async (query) => {
  if (query === '.exit') {
    rl.setPrompt(`\nThank you for using File Manager, ${username}, goodbye!`);
    rl.prompt();
    rl.close();
  }

  if (query === 'up') {
    currentPath = up(currentPath);
    rl.setPrompt(`You are currently in ${currentPath}\n`);
    rl.prompt();
  }

  if (query.startsWith('cd ')) {
    currentPath = await cd(currentPath, query);
    rl.setPrompt(`You are currently in ${currentPath}\n`);
    rl.prompt();
  }

});

rl.on('SIGINT', () => {
  rl.write(`\nThank you for using File Manager, ${username}, goodbye!`); 
  rl.close();
});


// rl.close();

// const echoInput = async (chunk) => {
//   const chunkStringified = chunk.toString().trim();

//   if (chunkStringified === '.exit') {
//     process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!`);
//     process.exit();
//   }
//   if (chunkStringified === 'up') {
//     currentPath = up(currentPath);
//     process.stdout.write('\n');
//   }

//   if (chunkStringified.startsWith('cd ')) {
//     // console.log('11111\n')
//     // currentPath = cd(currentPath, chunkStringified) + '\n';
//     currentPath = await cd(currentPath, chunkStringified);
//     process.stdout.write('\n');
//   }
//   process.stdout.write(`You are currently in ${currentPath}\n`);

//   // process.stdout.write(`Received from master process: ${chunk.toString()}\n`)
// };

// process.stdin.on('data', echoInput);

// process.on('SIGINT', () => {
//   process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`); 
//   process.exit();
// });
// // console.table([{name: 'Kek', name1: 'Kek1'}, {name: 'Kek2', name1: 'Kek3'}]);