const fs = require('fs');

const getFilePath = function (url) {
  if (url == '/') return './index.html';
  return './src/public' + url;
}

const parseArgs = function (args) {
  const parsedArgs = {};
  const argsToParse = args.split('&').map(x => x.split('='));
  argsToParse.map(arg => {
    parsedArgs[arg[0]] = arg[1].replace(/\+/g,' ');
  });
  const date = new Date().toLocaleString();
  parsedArgs.date = date;
  return parsedArgs;
}

const writeComments = function (req, res) {
  let commentsData = '';
  req.on('data', (chunk) => {
    commentsData += chunk;
  });

  req.on('end', () => {
    fs.readFile('./src/public/commentsData.json', 'utf8', (err, comments) => {
      let commentsJsonData = JSON.parse(comments);
      commentsJsonData.push(parseArgs(commentsData));
      comments = JSON.stringify(commentsJsonData);
      fs.writeFile('./src/public/commentsData.json', comments, () => { });
    });
    res.end();
  });
}

const app = (req, res) => {
  if (req.method == 'GET') {
    const filePath = getFilePath(req.url);
    fs.readFile(filePath, (err, content) => {
      try {
        res.write(content);
        res.statusCode = 200;
        res.end();
      } catch (err) {
        res.statusCode = 404;
        res.write('404 - The page cannot be found');
        res.end();
      }
    });
    return;
  }
  writeComments(req, res);
};

// Export a function that can act as a handler

module.exports = app;
