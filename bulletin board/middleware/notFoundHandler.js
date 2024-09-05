const path = require("path");

module.exports = (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "..", "Error", "image.png"));
};
