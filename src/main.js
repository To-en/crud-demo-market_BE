import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { ingredients } from './models/ingredients.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.set("query parser", "extended");
app.use(express.json());
app.use("/", router);

app.get("/", (_req, res) => { res.send("Ingredient ordering API"); });
app.get("/health", (_req, res) => res.json({ status: "ok", ingredients: ingredients.length }));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
