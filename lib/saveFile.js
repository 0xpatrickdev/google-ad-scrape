const fs = require('fs');

function saveFile({ path, data }) {
  fs.writeFile(path, data, { encoding: 'utf8', flag: 'w' }, () => console.log(`Saved ${path}`));
}

module.exports = saveFile;
