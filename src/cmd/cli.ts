// examples/basic-usage.js
import { cac } from 'cac';

const cli = cac('ai-cli').version('0.0.1').help();

cli.option('-c, --config', 'Edit Config File');

cli.option('-i, --info', 'Show Info');

cli
  .command('explain', 'Explain')
  .alias('e')
  .alias('')
  .action(() => {
    console.log('Explain');
  });

cli
  .command('complex', 'Complex Explain')
  .alias('c')
  .action(() => {
    console.log('Complex Explain');
  });

cli
  .command('transform', 'Transform Command')
  .alias('t')
  .action(() => {
    console.log('transform');
  });

// TODO: if no params, show help

cli.usage('Your AI helper');

const parsed = cli.parse();

if (parsed.options.config) {
  console.log('Edit Config File');
} else if (parsed.options.info) {
  console.log('Show Info');
}
