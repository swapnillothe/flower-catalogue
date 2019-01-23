const fs = require('fs');
const createTable = require('./commentTable.js');
const parseComments = require('./commentData.js');
const send = require('../util/sendRequest');
const sendFile = require('../util/filePath.js');
const formsTemplate = require('../public/formsTemplate');

const loadedData = {};

const readHtmlTemplate = function () {
  const content = fs.readFileSync('./public/guestBook.html', 'utf8');
  loadedData.guestBookTemplate = content;
}

const handleRequest = function (req, res) {
  sendFile(req, res);
}

const getLocalTime = function (data) {
  data.map(dataPart => {
    dataPart.date = (new Date(dataPart.date)).toLocaleString();
  });
  return data;
}

// const renderGuestBook = function (req, res) {
//   let htmlContent = loadedData.guestBookTemplate;
//   htmlContent = htmlContent.replace('_FORM_', formsTemplate.logInForm);
//   fs.readFile('./public/commentsData.json', (err, content) => {
//     const commentsData = JSON.parse(content);
//     getLocalTime(commentsData);
//     const table = createTable(commentsData);
//     send(res, htmlContent.replace("_table_", table));
//     return;
//   });
// }

const fillTemplate = function (req, res, data) {
  res.statusCode = 302;
  res.setHeader('location', '/guestBook.html');
  res.write(data);
  res.end();
}

// const renderLogIn = function (req, res) {
//   let htmlContent = loadedData.guestBookTemplate;
//   htmlContent = htmlContent.replace('_FORM_', formsTemplate.commentForm('swapnil'));
//   fs.readFile('./public/commentsData.json', (err, content) => {
//     const commentsData = JSON.parse(content);
//     getLocalTime(commentsData);
//     const table = createTable(commentsData);
//     const formContent = htmlContent.replace("_table_", table);
//     fillTemplate(req, res, formContent);
//     return;
//   });
// }

const getLoginPage = function () {
  const logInPage = formsTemplate.logInForm();
  return loadedData.guestBookTemplate.replace('_FORM_', logInPage);
}

const getCommentPage = function () {
  const commentPage = formsTemplate.commentForm();
  return loadedData.guestBookTemplate.replace('_FORM_', commentPage);
}

const isUserLoggedIn = function (req, res) {
  const cookie = req.headers.cookie;
  if (cookie) return true;
  return false;
}

const handleLogIn = function (req, res) {
  let guestBook = getLoginPage();
  if (isUserLoggedIn(req, res)) {
    guestBook = getCommentPage();
  }
  res.write(guestBook);
  res.end();
}

const logRequest = function(req,res,next){
  console.log(req.method,req.url);
  next();
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
app.use(logRequest);
app.post('/guestBook.html', writeComments);
app.get('/guestBook.html', handleLogIn);
app.get('/comments', refreshComments);
app.post('/logIn', handleLogIn);
app.use(handleRequest);
readHtmlTemplate();
module.exports = app.handleRequest.bind(app);