export const parseArg = () => {
  const stringArg = process.argv.slice(2).join('');

  if (stringArg.startsWith('--username=')) {
    const username = stringArg.slice(11);
    process.stdout.write(`Welcome to the File Manager, ${username}!\n`)
    return username;
  } else {
    process.stdout.write('Doesn\'t match template \'npm run start -- --username=your_username\'\nPlease try again!')
    process.exit();
  }
};
