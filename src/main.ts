import { exit } from 'process';

import logger from './utils/logger';
import { removeCookieBanner, getApartments } from './components/puppeteer';

const main = async () => {
  logger.info('Initializing app');

  await removeCookieBanner();
  console.log(await getApartments());
  logger.info('Goodbye!');
  exit(0);
};

main();
