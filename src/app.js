const fs = require('fs');

const getFilePath = function (url) {
  if (url == '/') return './index.html';
  // if(url=='/main.css')return '/main.css';
  return './src/public' + url;
}

const app = (req, res) => {
  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    try {
      res.write(content);
      res.statusCode = 200;
      res.end();
    } catch (err) {
      res.end();
    }
  })
};

// Export a function that can act as a handler

module.exports = app;
