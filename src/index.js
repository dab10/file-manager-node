import { parseArg } from "./cli/args.js";

const username = parseArg();

const echoInput = (chunk) => {
  const chunkStringified = chunk.toString().trim();

  if (chunkStringified === '.exit') {
    process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
  }
  // process.stdout.write(`Received from master process: ${chunk.toString()}\n`)
};

process.stdin.on('data', echoInput);
process.on('SIGINT', () => {
  process.stdout.write(`Thank you for using File Manager, ${username}, goodbye!`); 
  process.exit();
});
// console.table([{name: 'Kek', name1: 'Kek1'}, {name: 'Kek2', name1: 'Kek3'}]);