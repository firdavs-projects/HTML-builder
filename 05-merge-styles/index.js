const fs = require('fs');
const path = require('path');

const stream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const dir = '';

const addStyles = (dir, parent= '') => {
  fs.readdir(path.join(__dirname, dir), (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.stat(path.join(__dirname, dir, file), (err, stat) => {
        if (err) throw err;
        if (stat.isFile() && file.endsWith('.css') && parent === 'styles') {
          console.log(`${dir}: ${file.split('.').join(' - ')} - ${stat.size}bytes`);
          fs.readFile(path.join(__dirname, dir, file), 'utf8', (err, data) => {
            if (err) throw err;
            stream.write(data+'\n');
          });
        }
        if (stat.isDirectory()) {
          addStyles(dir + '/' + file, file);
        }
      });
    });
  });
};

addStyles(dir);

