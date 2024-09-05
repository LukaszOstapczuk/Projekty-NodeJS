module.exports = (err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send({ message: "Something broke!", error: err.message });
};
