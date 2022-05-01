import { exit } from 'process';

import logger from './utils/logger';
import { removeCookieBanner, getApartments } from './components/puppeteer';
import { apartmentExist, getApartmentById, insertApartment } from './components/db';

const main = async () => {
  logger.info('Initializing app');

  logger.info('Initializing DB');

  await removeCookieBanner();
  const apartments = await getApartments();

  console.log(await Promise.all(apartments.map(async (apartment) => {
    const exist = await apartmentExist(apartment.id);
    if (!exist) {
      logger.info(`New apartment found with ID ${apartment.id}`);
      return insertApartment(apartment);
    }
    logger.info(`Apartment with ID ${apartment.id} already present`);
    return getApartmentById(apartment.id);
    return null;
  })));

  logger.info('Goodbye!');
  exit(0);
};

main();
