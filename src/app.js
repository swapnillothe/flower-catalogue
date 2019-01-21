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
      data += createTable(commentsData);
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

const isSameUrl = (route1, route2) => {
  return route1.url == route2.url &&
    route1.method == route2.method;
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

  handleRequest(req, res) {
    const matchedRoutes = this.routes.filter(
      isSameUrl.bind(null, req)
    );
    if (matchedRoutes.length > 0) {
      matchedRoutes[0].handler(req, res);
    }
  }
}

const app = new App();
app.get('/', handleRequest);
app.get('/main.css', handleRequest);
app.get('/waterJar.js', handleRequest);
app.get('/photos/freshorigins.jpg', handleRequest);
app.get('/photos/animated-flower-image-0021.gif', handleRequest);
app.get('/guestBook.html', renderGuestBook);
app.get('/commentsData.json', handleRequest);
app.post('/guestBook.html', writeComments);

module.exports = app.handleRequest.bind(app);
