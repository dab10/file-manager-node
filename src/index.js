import os from 'node:os';
import { parseArg } from "./cli/args.js";
import { up } from "./fs/up.js";
import { cd } from './fs/cd.js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';
import { list } from './fs/ls.js';
import { cat } from './fs/cat.js';
import { add } from './fs/add.js';
import { rn } from './fs/rn.js';

let currentPath = os.homedir();
const username = parseArg(currentPath);
const rl = readline.createInterface({ input, output });

rl.on( 'line' , async (query) => {
  if (query === '.exit') {
    process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`);
    rl.close();
  }

  if (query === 'up') {
    currentPath = up(currentPath);
    process.stdout.write(`You are currently in ${currentPath}\n`);
  }

  if (query.startsWith('cd ')) {
    const isDirectoryCheck = true;
    currentPath = await cd(currentPath, query, isDirectoryCheck);
    process.stdout.write(`You are currently in ${currentPath}\n`);
  }

  if (query === 'ls') {
    const folderContain = await list(currentPath);
    console.table(folderContain);
    process.stdout.write(`You are currently in ${currentPath}\n`);
  }

  if (query.startsWith('cat ')) {
    rl.pause();
    await cat(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
  }   

  if (query.startsWith('add ')) {
    await add(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
  }   

  if (query.startsWith('rn ')) {
    await rn(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
  }  
});

rl.on('SIGINT', async () => {
    process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`); 
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