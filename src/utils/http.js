const http = require('http');
const fs = require('fs');

module.exports.download = (url, dest) => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(dest);

  http.get(url, (response) => {
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      resolve();
    });
  }).on('error', (err) => {
    fs.unlink(dest);

    reject(err);
  });
});
