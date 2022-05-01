import 'dotenv/config';

import logger from './utils/logger';
import { removeCookieBanner, getApartments } from './components/puppeteer';
import { apartmentExist, insertApartment } from './components/db';
import { sendApartmentAlert } from './components/telegram';
import matchesFilters from './components/searchFilter';

const mainLoop = async () => {
  logger.info('Searching for apartments');
  const apartments = await getApartments();

  await Promise.all(apartments.map(async (apartment) => {
    const exist = await apartmentExist(apartment.id);
    if (!exist) {
      logger.info(`New apartment found with ID ${apartment.id}`);
      if (matchesFilters(apartment)) await sendApartmentAlert(apartment);
      else logger.info('Not what you are looking for');
      return insertApartment(apartment);
    }
    logger.info(`Apartment with ID ${apartment.id} already present`);
    return null;
  }));

  setTimeout(mainLoop, parseInt(process.env.SEARCH_INTERVAL || '5', 10) * 60000);
};

const main = async () => {
  logger.info('Initializing app');
  await removeCookieBanner();

  logger.info('Initializing DB');

  await mainLoop();
};

main();
