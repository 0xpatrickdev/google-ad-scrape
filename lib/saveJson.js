const fs = require('fs');

function saveJson({ path, data }) {
  fs.writeFile(path, JSON.stringify(data, null, 2), { encoding: 'utf8', flag: 'w' }, () =>
    console.log(`Saved ${path}`),
  );
}

module.exports = saveJson;
