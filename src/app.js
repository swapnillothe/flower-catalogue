const fs = require('fs');
const createTable = require('./commentTable.js');
const parseComments = require('./commentData.js');
const sendFile = require('../util/filePath.js');
const PORT = process.env.PORT || 8080;
const formsTemplate = require('../public/formsTemplate');
const express = require("express");
const app = express();

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

const getCommentPage = function (name) {
  const commentPage = formsTemplate.commentForm(name);
  return loadedData.guestBookTemplate.replace('_FORM_', commentPage);
}

const isUserLoggedIn = function (req, res) {
  const cookie = req.headers.cookie;
  if (cookie && cookie.split('; ').some(nameValue => nameValue.startsWith('name='))) {
    return true;
  }
  loggedInUsers.push(cookie);
  return false;
}

const loggedInUsers = [];

const handleLogIn = function (req, res) {
  res.statusCode = 302;
  res.setHeader('Set-Cookie', `${req.body}`)
  res.setHeader('location', '/guestBook.html');
  res.end();
}

const getUserName = function (req) {
  const cookies = req.headers.cookie.split("; ");
  const nameValue = cookies.find(nameValue => nameValue.startsWith('name=')) || 'default';
  return nameValue.replace('name=', '');
}

const serveGuestBook = function (req, res) {
  if (isUserLoggedIn(req, res)) {
    const commentor = getUserName(req);
    res.write(getCommentPage(commentor));
    res.end();
    return;
  }
  res.write(getLoginPage());
  res.end();
}

const handleLogOut = function (req, res) {
  res.setHeader('Set-Cookie', 'name=deleted; expires=Thu, 18 Dec 2013 12:00:00 UTC');
  res.statusCode = 302;
  res.setHeader('location', '/guestBook.html');
  res.end();
}

const logRequest = function (req, res, next) {
  console.log(req.method, req.url);
  next();
}

const refreshComments = function (req, res) {
  fs.readFile('./public/commentsData.json', "UTF8", (err, content) => {
    console.log("this is content", content);
    const commentsData = JSON.parse(content);
    getLocalTime(commentsData);
    const commentsHtml = createTable(commentsData);
    res.send(commentsHtml);
  });
}

const writeComments = function (req, res) {
  let commentsToAdd = req.body;
  const commentsFilePath = './public/commentsData.json';
  fs.readFile(commentsFilePath, (err, content) => {
    const commentsData = JSON.parse(content);
    const parsedComment = parseComments(commentsToAdd);
    parsedComment.name = getUserName(req);
    commentsData.unshift(parsedComment);
    fs.writeFile(commentsFilePath, JSON.stringify(commentsData), 'utf8', () => {
      serveGuestBook(req, res);
    });
  });
}

const readPostData = function (req, res, next) {
  let postedData = '';
  req.on('data', (chunk) => {
    postedData = postedData + chunk;
  });
  req.on('end', () => {
    req.body = postedData;
    next();
  });
}



app.use(logRequest);
app.use(readPostData);

app.post('/guestBook.html', writeComments);
app.get('/guestBook.html', serveGuestBook);
app.get('/comments', refreshComments);
app.post('/login', handleLogIn);
app.post('/logout', handleLogOut);
app.use(handleRequest);
readHtmlTemplate();

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
})