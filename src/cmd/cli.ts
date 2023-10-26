// examples/basic-usage.js
import { cac } from 'cac';

const cli = cac('aicli').version('0.0.1').help();

cli
  .command('rm <dir>', 'Remove a dir')
  .option('-r, --recursive', 'Remove recursively')
  .action((dir, options) => {
    console.log('remove ' + dir + (options.recursive ? ' recursively' : ''));
  });

cli.help();

cli.parse();
