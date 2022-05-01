/* eslint-disable import/prefer-default-export */
import puppeteer from 'puppeteer';

import {
  removeCookieBanner as removeCookieBannerFromWgGesucht,
  getApartments as getApartmentsFromWgGesucht,
} from './wgGesucht';

const browser = puppeteer.launch({
  args: ['--window-size=1920,1080'],
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

export const removeCookieBanner = () => removeCookieBannerFromWgGesucht(browser);
export const getApartments = () => getApartmentsFromWgGesucht(browser);
