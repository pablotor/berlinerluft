import puppeteer from 'puppeteer';
import { Apartment } from '../../types/main';

import logger from '../../utils/logger';

const urls = {
  base: process.env.URL_BASE,
  search: process.env.URL_SEARCH,
};

// const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

const formatDates = (dates: string) => {
  const stringToDate = (date: string) => date.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1');

  if (dates.startsWith('ab ')) {
    return {
      from: new Date(stringToDate(dates.slice(3))),
    };
  }
  const [from, to] = dates.split(' - ');
  return {
    from: new Date(stringToDate(from)),
    to: new Date(stringToDate(to)),
  };
};

export const removeCookieBanner = async (browser: Promise<puppeteer.Browser>) => {
  logger.info('Opening wg-gesucht');
  if (!urls.base) {
    throw new Error('URL_BASE not found. Check this param is present in .env file');
  }
  const page = await (await browser).newPage();
  await page.goto(urls.base, { waitUntil: 'networkidle2' });
  const cookieBannerIsClosed = await page.$('.cmpboxclosed');
  if (!cookieBannerIsClosed) {
    logger.info('Cookie banner detected');
    const customButtom = await page.$('#cmpwelcomebtncustom');
    await customButtom?.click();
    await page.waitForSelector('.cmpboxbtnyescustomchoices');
    logger.info('Saving cookie preferences');
    const acceptPreferencesButtom = await page.$('.cmpboxbtnyescustomchoices');
    await acceptPreferencesButtom?.click();
    logger.info('Saved!');
  } else {
    logger.info('Cookie banner not detected');
  }
};

export const getApartments = async (browser: Promise<puppeteer.Browser>) => {
  logger.info('Geting apartment search from wg-gesucht');
  if (!urls.search) {
    throw new Error('URL_SEARCH not found. Check this param is present in .env file');
  }
  const apartments: Apartment[] = [];
  const page = await (await browser).newPage();
  await page.goto(urls.search, { waitUntil: 'networkidle2' });

  const apartmentArray = await page.$$('[id^="liste-details-ad-"]');
  await Promise.all(apartmentArray.map(async (apartmentCard) => {
    const innerText = await page.evaluate((node) => node.innerText, apartmentCard);
    if (innerText.split('\n').length === 7) {
      const id = await page.evaluate((node) => node.getAttribute('data-id'), apartmentCard);
      const href = await page.evaluate((node) => node.querySelector('a').getAttribute('href'), apartmentCard);
      const style = await page.evaluate((node) => node.querySelector('a').getAttribute('style'), apartmentCard);
      const img = style.slice(22, -2);
      const [
        title,
        subtitle,
        price,
        dates,
        size,
        postedBy,
      ] = innerText.split('\n');
      apartments.push({
        id,
        title,
        subtitle,
        price: parseInt(price, 10),
        dates: formatDates(dates),
        size: parseInt(size, 10),
        postedBy,
        url: `${urls.base}${href}`,
        img,
      });
    }
  }));
  await page.close();
  return apartments;
};
