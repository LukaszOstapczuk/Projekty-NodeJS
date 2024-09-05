const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const authenticate = require("./auth");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

const client = new MongoClient(process.env.DB_URI, {
  serverApi: ServerApiVersion.v1,
});

const app = express();
app.use(express.json());

const port = process.env.PORT;

const args = process.argv.slice(2);
const debugMode = args.includes("debug");

const logFilePath = path.join(__dirname, "request_logs.log");

if (debugMode) {
  const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
  app.use(morgan("combined", { stream: logStream }));
}

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    const db = client.db("Nodedatabase");
    const adsCollection = db.collection("ads");

    require("./routes/getRoutes")(app, adsCollection);
    require("./routes/postRoutes")(app, adsCollection);
    require("./routes/deleteRoutes")(app, adsCollection, authenticate);
    require("./routes/patchRoutes")(app, adsCollection, authenticate);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(port, () => console.log(`Server running on port ${port}`));
  })

  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
