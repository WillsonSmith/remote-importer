const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const url = require('url');
const {promisify} = require('util');

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const [_, ...cliArguments] = process.argv;
const source = cliArguments[1];

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

async function isPathOrFile(path) {
  const result = await stat(path);
  return result.isFile() ? 'file' : 'path';
}

async function getUrlsForFile(file) {
  const doc = await readFile(file, 'utf8');
  return [...doc.matchAll(urlRegex)].map(url => url[0]);
}

function getUrlFileName(url) {
  const parsedUrl = new URL(url);
  return [url, parsedUrl.pathname.substring(1).replace(new RegExp('/', 'g'), '_')];
}

async function downloadFiles(urls) {
  const files = await Promise.all(
    urls.map(url => fetch(url))
  ).then((downloads) => {
    return Promise.all(
      downloads.map(
        async (download) => [getUrlFileName(download.url), await download.text()]
      )
    );
  });
  return files;
}

getUrlsForFile(source).then(async (urls) => {
  const files = await downloadFiles(urls);
  files.forEach((file) => {
    writeFile(`src/${file[0][1]}`, file[1]);
  });

  let doc = await (readFile(source, 'utf8'));

  files.forEach((file) => {
    const urlToReplace = file[0][0];
    doc = doc.replace(urlToReplace, `./${file[0][1]}`);
  });
  writeFile(`src/build.js`, doc);
});

