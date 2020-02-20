const fetchCompanies = require('./lib/fetchCompanies');
const checkGoogleSearch = require('./lib/checkGoogleSearch');
const saveFile = require('./lib/saveFile');
const printResults = require('./lib/printResults');

const COMPANY_COUNT = 50; // max = 500
const SAVE_SCREENSHOTS = true;

(async () => {
  try {
    // fetch companies
    const companies = await fetchCompanies();
    console.log(`Found ${companies.length} companies.`);

    // save them to a json file (for now)
    saveFile({ path: 'data/companies.json', data: JSON.stringify(companies, null, 2) });

    // only check google for COMPANY_COUNT companies
    const fortune50 = companies.slice(0, COMPANY_COUNT);

    let results = [];
    let adPresentCount = 0;

    // iterate over scrape google function
    // save a screenshot when SAVE_SCREENSHOTS is true
    for (i in fortune50) {
      const result = await checkGoogleSearch({
        keyword: companies[i],
        index: i,
        screenshot: SAVE_SCREENSHOTS,
      });
      result.adPresent && adPresentCount++;
      results.push(result);
    }

    // save them to a json file (for now)
    saveFile({ path: 'data/results.json', data: JSON.stringify(results, null, 2) });

    // print the results to a markdown table
    printResults(results);

    // log result
    console.log(`${adPresentCount} of ${results.length} companies have ads.`);
  } catch (e) {
    console.log('Error', e);
    return;
  }
})();
