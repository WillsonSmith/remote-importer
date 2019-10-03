const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

const [_, ...cliArguments] = process.argv;
const source = cliArguments[1];

const urlRegex = new RegExp(`https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)`, 'g');

async function isPathOrFile(path) {
  const result = await stat(path);
  return result.isFile() ? 'file' : 'path';
}

async function getUrlsForFile(file) {
  const doc = await readFile(file, 'utf8');
  const urls = urlRegex.exec(doc);
  console.log(urls);
  // const urls = 
}
getUrlsForFile(source);
// isPathOrFile(source).then((res) => console.log(res));