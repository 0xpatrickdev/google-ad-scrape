const saveFile = require('./saveFile');

function printResults(results) {
  let tableBase = `
  | # | Company | Ad | Screenshot | Urls |
  | --- | --- | --- | --- | --- |
  `;

  for (result of results) {
    const newLine = `| ${result.position} | ${result.company} | ${
      result.adPresent ? 'Yes' : 'No'
    } | [Screenshot](${result.filepath.replace(/ /g, '%20')}) | ${result.urls.join(', ')}|
    `;
    tableBase += newLine;
  }

  return saveFile({ path: 'RESULTS.md' }, { data: tableBase });
}

module.exports = printResults;
