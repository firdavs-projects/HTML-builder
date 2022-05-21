const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

// copy assets
const assetsDir = 'assets';
const copyDir = 'project-dist/assets';
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
            console.log(`copy file: ${dir}/${file} - ${stats.size}bytes`);
          });
        }
        if (stats.isDirectory()) {
          copyFile(dir + '/' + file, copyDir + '/' + file);
        }
      });
    });
  });
};
copyFile(assetsDir, copyDir);

// add styles
const styleStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
const dir = '';
const addStyles = (dir, parent= '') => {
  fs.readdir(path.join(__dirname, dir), (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.stat(path.join(__dirname, dir, file), (err, stat) => {
        if (err) throw err;
        if (stat.isFile() && file.endsWith('.css') && parent === 'styles') {
          console.log(`add styles from: ${dir}/${file} - ${stat.size}bytes`);
          fs.readFile(path.join(__dirname, dir, file), 'utf8', (err, data) => {
            if (err) throw err;
            styleStream.write(data+'\n');
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

// add html
const components = {};
const indexHtmlStreamWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
const templateHtmlStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

fs.readdir(path.join(__dirname, 'components'), (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    fs.stat(path.join(__dirname, 'components', file), (err, stat) => {
      if (err) throw err;
      if (stat.isFile() && file.endsWith('.html')) {
        console.log(`add component: components/${file} - ${stat.size}bytes`);
        fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8')
          .on('data', text => components[file.split('.')[0]] = text);
      }
    });
  });
});

setTimeout(() => {
  templateHtmlStream.on('data', text => {
    Object.entries(components).forEach(([key, value]) => {
      text = text.replace(`{{${key}}}`, value);
    });
    indexHtmlStreamWrite.write(text);
    console.log(`create file: ${__dirname}/project-dist/index.html`);
  });
}, 500);
