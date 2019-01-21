const fs = require('fs');
const createTable = require('./commentTable.js');
const parseComments = require('./commentData.js');
const send = require('../util/sendRequest');
const sendFile = require('../util/filePath.js')

const handleRequest = function (req, res) {
  sendFile(req, res);
}

const renderGuestBook = function (req, res) {
  fs.readFile('./public/commentsData.json', (err, content) => {
    const commentsData = JSON.parse(content);
    fs.readFile('./public/guestBook.html', (err, data) => {
      data = data + createTable(commentsData);
      send(res, data);
      return;
    })
  })
}

const writeComments = function (req, res) {
  let commentsToAdd = '';
  req.on('data', (chunk) => {
    commentsToAdd = commentsToAdd + chunk;
  });

  req.on('end', () => {
    fs.readFile('./public/commentsData.json', (err, content) => {
      const commentsData = JSON.parse(content);
      const commentsFilePath = './public/commentsData.json';
      commentsData.unshift(parseComments(commentsToAdd));
      const comments = JSON.stringify(commentsData);
      const commentDataTable = createTable(commentsData);
      fs.readFile('./public/guestBook.html', 'utf8', (err, guestBook) => {
        fs.writeFile(commentsFilePath, comments, 'utf8', () => {
          send(res, guestBook + commentDataTable);
        });
      })
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
app.use(handleRequest);

module.exports = app.handleRequest.bind(app);