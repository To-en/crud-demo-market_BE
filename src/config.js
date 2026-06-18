const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config(); // Load env
dotenvExpand.expand(myEnv); // expand env variable self-reference

module.exports = {
  log: {
    level: process.env.LOG_LEVEL || "info",
  },
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL,
    logging: process.env.DATABASE_LOGGING === "true",
  },
  // minio: {
  //   endpoint: process.env.MINIO_ENDPOINT || "127.0.0.1",
  //   port: Number(process.env.MINIO_PORT) || 9000,
  //   useSSL: process.env.MINIO_USE_SSL === "true",
  //   accessKey: process.env.MINIO_ACCESS_KEY,
  //   secretKey: process.env.MINIO_SECRET_KEY,
  // },
  assets: {
    path: process.env.ASSETS_PATH || __dirname + "/assets",
  },
};
