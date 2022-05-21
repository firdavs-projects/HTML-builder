const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const stream = fs.createWriteStream(path.join(__dirname,'text.txt'), { flags: 'a' });
const rl = readline.createInterface({ input, output });

console.log('Введите текст:');
rl.on('line', text => {
  text === 'exit' ? rl.close() : stream.write(`${text}\n`);
});
rl.on('close', () => {
  console.log('Текст сохранен');
  rl.close();
});


