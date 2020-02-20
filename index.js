const fetchCompanies = require('./lib/fetchCompanies');
const checkGoogleSearch = require('./lib/checkGoogleSearch');
const saveJson = require('./lib/saveJson');

const COMPANY_COUNT = 50; // max = 500
const SAVE_SCREENSHOTS = true;

(async () => {
  try {
    // fetch companies
    const companies = await fetchCompanies();
    console.log(`Found ${companies.length} companies.`);

    // save them to a json file (for now)
    saveJson({ path: 'data/companies.json', data: companies });

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
    saveJson({ path: 'data/results.json', data: results });

    // log result
    console.log(`${adPresentCount} of ${results.length} companies have ads.`);

    // TO DO: print results to .md table
  } catch (e) {
    console.log('Error', e);
    return;
  }
})();
