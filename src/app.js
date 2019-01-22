const fs = require('fs');
const createTable = require('./commentTable.js');
const parseComments = require('./commentData.js');
const send = require('../util/sendRequest');
const sendFile = require('../util/filePath.js')

const handleRequest = function (req, res) {
  sendFile(req, res);
}

const getLocalTime = function (data) {
  data.map(dataPart => {
    dataPart.date = (new Date(dataPart.date)).toLocaleString();
  });
  return data;
}

const renderGuestBook = function (req, res) {
  fs.readFile('./public/commentsData.json', (err, content) => {
    const commentsData = JSON.parse(content);
    getLocalTime(commentsData);
    fs.readFile('./public/guestBook.html', "utf-8", (err, data) => {
      const table = createTable(commentsData);
      send(res, data.replace("_table_", table));
      return;
    });
  });
}

const refreshComments = function (req, res) {
  fs.readFile('./public/commentsData.json', (err, content) => {
    const commentsData = JSON.parse(content);
    getLocalTime(commentsData);
    const commentsHtml = createTable(commentsData);
    send(res, commentsHtml);
  });
}

const writeComments = function (req, res) {
  let commentsToAdd = '';
  req.on('data', (chunk) => {
    commentsToAdd = commentsToAdd + chunk;
  });

  req.on('end', () => {
    const commentsFilePath = './public/commentsData.json';
    fs.readFile(commentsFilePath, (err, content) => {
      const commentsData = JSON.parse(content);
      commentsData.unshift(parseComments(commentsToAdd));
      const comments = JSON.stringify(commentsData);
      fs.writeFile(commentsFilePath, comments, 'utf8', () => {
        renderGuestBook(req, res);
      });
    });
  });
}

const isSameUrl = (req, route) => {
  if (route.handler && !(route.method || route.url)) {
    return true;
  }
  if (req.url == route.url && req.method == route.method) {
    return true
  };
  return false;
}

class App {
  constructor() {
    this.routes = [];
  }

  get(url, handler) {
    const route = { url, handler, method: 'GET' };
    this.routes.push(route);
  }

  post(url, handler) {
    const route = { url, handler, method: 'POST' };
    this.routes.push(route);
  }

  use(handler) {
    this.routes.push({ handler });
  }

  handleRequest(req, res) {
    const matchedRoutes = this.routes.filter(
      isSameUrl.bind(null, req)
    );
    const next = () => {
      if (matchedRoutes.length == 0) return;
      const currentHandler = matchedRoutes[0];
      matchedRoutes.shift();
      currentHandler.handler(req, res, next);
    }
    next();
  }
}

const app = new App();
app.post('/guestBook.html', writeComments);
app.get('/guestBook.html', renderGuestBook);
app.get('/comments', refreshComments);
app.use(handleRequest);

module.exports = app.handleRequest.bind(app);