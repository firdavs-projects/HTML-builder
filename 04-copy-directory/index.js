const fs = require('fs');
const path = require('path');

const dir = 'files';
const copyDir = 'files-copy';

const copyFile = (dir, copyDir) => {
  fs.mkdir(path.join(__dirname, copyDir), { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdir(path.join(__dirname, dir), (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.stat(path.join(__dirname, dir, file), (err, stats) => {
        if (err) throw err;
        if (stats.size) {
          fs.copyFile(path.join(__dirname, dir, file), path.join(__dirname, copyDir, file), (err) => {
            if (err) throw err;
            console.log(`${file.split('.').join(' - ')} - ${stats.size}bytes`);
          });
        }
        if (stats.isDirectory()) {
          copyFile(dir + '/' + file, copyDir + '/' + file);
        }
      });
    });
  });
};

copyFile(dir, copyDir);