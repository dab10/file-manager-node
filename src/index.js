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
import { cp } from './fs/cp.js';
import { mv } from './fs/mv.js';
import { rm } from './fs/rm.js';
import { osFM } from './os/osFM.js';
import { hash } from './hash/hash.js';
import { compress } from './zip/compress.js';
import { decompress } from './zip/decompress.js';

let currentPath = os.homedir();
const username = parseArg(currentPath);
const rl = readline.createInterface({ input, output });

rl.on( 'line' , async (query) => {
  if (query === '.exit') {
    process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`);
    rl.close();
    return;
  }

  if (query === 'up') {
    currentPath = up(currentPath);
    process.stdout.write(`You are currently in ${currentPath}\n`);
    return;
  }

  if (query.startsWith('cd ')) {
    const isDirectoryCheck = true;
    currentPath = await cd(currentPath, query, isDirectoryCheck);
    process.stdout.write(`You are currently in ${currentPath}\n`);
    return;
  }

  if (query === 'ls') {
    const folderContain = await list(currentPath);
    console.table(folderContain);
    process.stdout.write(`You are currently in ${currentPath}\n`);
    return;
  }

  if (query.startsWith('cat ')) {
    rl.pause();
    await cat(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
    return;
  }   

  if (query.startsWith('add ')) {
    await add(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    return;
  }   

  if (query.startsWith('rn ')) {
    await rn(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    return;
  }  

  if (query.startsWith('cp ')) {
    rl.pause();
    await cp(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
    return;
  }  

  if (query.startsWith('mv ')) {
    rl.pause();
    await mv(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
    return;
  }  

  if (query.startsWith('rm ')) {
    rl.pause();
    await rm(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
    return;
  }  

  if (query.startsWith('os ')) {
    await osFM(query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    return;
  }  

  if (query.startsWith('hash ')) {
    rl.pause();
    await hash(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
    return;
  }  

  if (query.startsWith('compress ')) {
    rl.pause();
    await compress(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
    return;
  }

  if (query.startsWith('decompress ')) {
    rl.pause();
    await decompress(currentPath, query);
    process.stdout.write(`\nYou are currently in ${currentPath}\n`);
    rl.resume();
    return;
  } else {
    process.stdout.write(`Invalid input\n`);
    process.stdout.write(`You are currently in ${currentPath}\n`);
    return;
  }
});

rl.on('SIGINT', async () => {
    process.stdout.write(`\nThank you for using File Manager, ${username}, goodbye!`); 
    rl.close();
});
