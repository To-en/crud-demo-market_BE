import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerBaseUrl } from './swagger.js';
import router from './routes/index.js';
import sequelize from './sequelize.js'
import logger from './logger.js'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

const app = express();
const PORT = process.env.PORT || 3000;

// If use npm run start --sync-db or -s it will force alter actual db to match sequelized definition of model
// (Which I won't recommend doing)
const argv = yargs(hideBin(process.argv))
  .option("sync-db", {
    alias: "s",
    description: "Synchronize the database",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;

// --- Sync with DB
if (argv.syncDb) {
  logger.info("Synchronizing database...");
  await sequelize.sync({ alter: { drop: false } });
  logger.info("Database synchronized");
  await sequelize.close();
}

// --- Server Bootstraps 
app.use(cors(
  // Allow these (Except the rest)
  // Excecpt these (Allow the rest)
));
app.set("query parser", "extended");
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (_req, res) => { res.send("Ingredient Market API"); });
app.get("/health", (_req, res) => res.json({ status: "ok", ingredients: ingredients.length })); // health check should return health things

// API Endpoint routes
app.use("/api", router);
app.listen(PORT, () => { 
  console.log(`"--- Listening to http://localhost:${PORT} ---"`); 
  console.log(`"--- Swagger UI at ${swaggerBaseUrl}/api-docs ---"`);
});



