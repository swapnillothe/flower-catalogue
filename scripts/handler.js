const sendFile = require('./../util/filePath.js');

const handleRequest = function (req, res) {
  sendFile(req, res);
}

module.exports = {
  handleRequest
};
