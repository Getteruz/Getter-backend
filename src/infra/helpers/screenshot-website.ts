import * as puppeteer from 'puppeteer';

const ScreenShotWebsite = async (link: string, path: string) => {
  return await puppeteer
    .launch({
      headless: false,
      defaultViewport: {
        width: 1920,
        height: 1084,
      },
    })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(link, {
        waitUntil: 'domcontentloaded',
      });
      await page.screenshot({ path });
      await browser.close();
    });
};

export default ScreenShotWebsite;
