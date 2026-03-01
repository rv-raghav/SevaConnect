require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./utils/logger");

let env;
try {
  env = require("./config/env");
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}

const app = require("./app");
const PORT = env.PORT;

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("DB connection failed");
    logger.error(err.message);
    process.exit(1);
  });
