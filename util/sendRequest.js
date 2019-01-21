const send = (res, content, statusCode = 200) => {
  res.write(content);
  res.statusCode = statusCode;
  res.end();
}

module.exports = send;