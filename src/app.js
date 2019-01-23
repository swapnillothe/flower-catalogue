const fs = require('fs');
const createTable = require('./commentTable.js');
const parseComments = require('./commentData.js');
const send = require('../util/sendRequest');
const sendFile = require('../util/filePath.js');
const formsTemplate = require('../public/formsTemplate');
const App = require('./framework');
const app = new App();

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

const loggedInUsers = []

const handleLogIn = function (req, res) {
  let guestBook = getLoginPage();
  if (isUserLoggedIn(req, res)) {
    guestBook = getCommentPage();
   }
  res.write(guestBook);
  res.end();
}

const handleLogOut = function (req, res) {
  res.setHeader('Set-Cookie', 'Expires:Mon, 18 Feb 2013 19:08:41 GMT');
  res.statusCode = 302;
  res.setHeader('location', '/guestBook.html');
  handleLogIn(req, res);
}

const logRequest = function (req, res, next) {
  console.log(req.method, req.url);
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
        handleLogIn(req, res);
      });
    });
  });
}

app.use(logRequest);
app.post('/guestBook.html', writeComments);
app.get('/guestBook.html', handleLogIn);
app.get('/comments', refreshComments);
app.post('/login', handleLogIn);
app.post('/logout', handleLogOut);
app.use(handleRequest);
readHtmlTemplate();
module.exports = app.handleRequest.bind(app);