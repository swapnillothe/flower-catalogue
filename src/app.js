const app = (req, res) => {
  res.statusCode = 404;
  res.end();
};

// Export a function that can act as a handler

module.exports = app;
