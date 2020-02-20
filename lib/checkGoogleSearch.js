const puppeteer = require('puppeteer');

const HEADLESS = true;

async function checkGoogleSearch({ keyword, index, screenshot }) {
  const browser = await puppeteer.launch({ headless: HEADLESS });
  const page = await browser.newPage();

  // search google for company name
  await page.goto(`https://google.com/search?q=${keyword}`);

  // it seems the ads are all in this div#taw
  // it always appears, so we'll check the height to see if something's in there
  const adContainer = 'div#taw';
  await page.waitForSelector(adContainer);

  const res = await page.evaluate(adContainer => {
    // get height, see if it's > 0
    const height = document.querySelector(adContainer).clientHeight;
    const adPresent = height > 0;

    // the cite querySelector seems to be a good way to parse the search result urls
    const urlScrape = [...document.querySelectorAll('cite')].map(x => x.innerText);
    const urls = urlScrape.slice(0, 5).filter(x => x.length > 0);

    // return an object of results to display
    return { adPresent, urls };
  }, adContainer);

  const position = Number(index) + 1;
  const filepath = `screenshots/${position}-${keyword}.png`;
  screenshot && (await page.screenshot({ path: filepath }));

  await browser.close();

  // add company name and filepath to result
  return Object.assign(res, { company: keyword, position }, screenshot && { filepath });
}

module.exports = checkGoogleSearch;
