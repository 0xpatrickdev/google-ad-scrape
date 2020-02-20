const puppeteer = require('puppeteer');

const HEADLESS = true;

async function fetchCompanies() {
  const browser = await puppeteer.launch({ headless: HEADLESS });
  const page = await browser.newPage();

  // go to list of fortune 500
  await page.goto('https://fortune.com/fortune500/2019/search/');

  // // change from 10 per page to 100 per page
  const inputSelector = 'select[aria-label="rows per page"]';
  await page.waitForSelector(inputSelector);
  await page.select(inputSelector, '100');

  // go to the next page
  async function goToNextPage() {
    const nextButtonSelector = '.-next button';
    await page.waitForSelector(nextButtonSelector);
    await page.click(nextButtonSelector);
  }

  // Extracts + returns an array of companies: ['Apple', 'Walmart']
  async function scrapeCompanies() {
    const rowSelector = '[class^="searchResults__cellContent"] span div';
    await page.waitForSelector(rowSelector);

    const companies = await page.evaluate(rowSelector => {
      return [...document.querySelectorAll(rowSelector)].map(row => row.innerText);
    }, rowSelector);

    return companies;
  }

  // 100 companies per page. 500 total. we need to run scrapeCompanies() 5x
  // while clicking the next button after each go.
  let companies = [];

  while (companies.length < 500) {
    // go to the next page
    if (companies.length >= 100) {
      await goToNextPage();
    }
    // scrape the page
    companies.push(...(await scrapeCompanies()));
  }

  await browser.close();

  return companies;
}

module.exports = fetchCompanies;
