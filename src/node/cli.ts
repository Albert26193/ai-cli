import { cac } from 'cac';

const cli = cac('ai-tldr').help();

cli
  .command('dev')
  .version('0.0.1')
  .action(async () => {
    console.log('dev');
  });

console.log('cli');
