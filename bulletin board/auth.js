const users = [
  { username: "user1", password: "pass1" },
  { username: "user2", password: "pass2" },
  { username: "user3", password: "pass3" },
];

function authenticate(req, res, next) {
  const { authorization } = req.headers;
  const credentials = authorization && authorization.split(" "); // "Basic encodedstring"

  if (!credentials || credentials[0] !== "Basic" || credentials.length !== 2) {
    return res
      .status(401)
      .send({ message: "Authorization header is missing or invalid" });
  }

  const decoded = Buffer.from(credentials[1], "base64").toString("utf8");
  const [username, password] = decoded.split(":");

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  req.user = user;
  next();
}

module.exports = authenticate;
