const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, (err, files) => {
  err
    ? console.log(err)
    : files.map(file => {
      fs.stat(path.join(dir, file), (err, stats) => {
        if (err) {
          console.log(err);
        } else if (stats.size) {
          console.log(`${file.split('.').join(' - ')} - ${stats.size}bytes`);
        }
      });
    });
});