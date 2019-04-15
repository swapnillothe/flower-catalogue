const homeUrl = './public/index.html';
const publicUrl = './public';
const fs = require('fs');

const getContentType = function (contentTitle) {
  if (contentTitle.includes('.pdf')) {
    return 'application/pdf';
  }
  return `text/${contentTitle.split('.')[2]}`;
}

const sendFile = (req, res) => {
  const filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.status(404).send('404 - The page cannot be found');
      return;
    }
    const contentType = getContentType(filePath);
    res.set('Content-Type', `${contentType}`);
    res.status(200).send(content);
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