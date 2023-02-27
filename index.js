const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./logger");
const cors = require("cors");

const app = express();
logger.info("Starting server...");

app.use(cors());

app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

require("./startup/routes")(app);

module.exports = server;
