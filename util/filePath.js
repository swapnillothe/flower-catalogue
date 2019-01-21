const homeUrl = './public/index.html';
const publicUrl = './public';
const fs = require('fs');
const send = require('./sendRequest.js');

const sendFile = (req, res) => {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    try {
      send(res, content);
    } catch (err) {
      send(res, '404 - The page cannot be found', 404);
    }
    return;
  });
}

const getFilePath = function (url) {
  if (url == '/') {
    return homeUrl;
  }
  return publicUrl + url;
}

module.exports = sendFile;