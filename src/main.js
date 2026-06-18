import express from 'express';
import cors from 'cors';
import router from './routes';
import sequelize from './sequelize';
import { ingredients } from './models/ingredients.model';
const app = express();
const PORT = process.env.PORT || 3001;

// --- Server Bootstraps 
app.use(cors(
  // Allow these (Except the rest)
  // Excecpt these (Allow the rest)
));
app.set("query parser", "extended");
app.use(express.json());
// Default url routes
app.get("/", (_req, res) => { res.send("Ingredient Market API"); });
app.get("/health", (_req, res) => res.json({ status: "ok", ingredients: ingredients.length })); // health check should return health things
// API Endpoint routes
app.use("/api", router);
app.listen(PORT, () => { console.log(`"--- Listening to http://localhost:${PORT} ---"`); });

// --- Sync with DB
async function main() {
  if (argv.syncDb) {
    logger.info("Synchronizing database...");
    await sequelize.sync({ alter: { drop: false } });
    logger.info("Database synchronized");
    await sequelize.close();
    return;
  }
}
