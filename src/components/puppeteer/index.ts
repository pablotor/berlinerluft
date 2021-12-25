import puppeteer from 'puppeteer';

import inSignin from './signin';

const browser = puppeteer.launch({
  args: [`--window-size=1920,1080`],
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

export const signin = () => inSignin(browser);
