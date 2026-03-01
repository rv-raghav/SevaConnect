const isProduction = process.env.NODE_ENV === "production";

const write = (stream, level, message) => {
  const timestamp = new Date().toISOString();
  stream.write(`[${timestamp}] [${level}] ${message}\n`);
};

const logger = {
  info(message) {
    if (!isProduction) {
      write(process.stdout, "INFO", message);
    }
  },

  warn(message) {
    if (!isProduction) {
      write(process.stdout, "WARN", message);
    }
  },

  error(message) {
    write(process.stderr, "ERROR", message);
  },
};

module.exports = logger;
