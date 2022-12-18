import os from 'node:os';

export const osFM = async (query) => {
  const queryCommand = query.slice(3);
  if (queryCommand === '--EOL') {
    return process.stdout.write(JSON.stringify(os.EOL));
  }
  if (queryCommand === '--cpus') {
    const allData = os.cpus();
    process.stdout.write(`Total CPU: ${allData.length}\n`);
    allData.map(item => process.stdout.write(`model: ${item.model}\nspeed: ${item.speed / 1000} GHz\n`))
    return;
  }
  if (queryCommand === '--homedir') {
    return process.stdout.write(os.homedir());
  }
  if (queryCommand === '--username') {
    return process.stdout.write(os.userInfo().username);
  }
  if (queryCommand === '--architecture') {
    return process.stdout.write(os.arch());
  } else {
    return process.stdout.write('Invalid input\n');
  }
}