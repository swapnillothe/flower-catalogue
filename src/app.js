const fs = require('fs');

const getFilePath = function (url) {
  if (url == '/') return './index.html';
  return './src/public' + url;
}

const app = (req, res) => {
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
  })
};

// Export a function that can act as a handler

module.exports = app;
