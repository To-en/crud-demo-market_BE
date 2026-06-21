import { Router } from 'express';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { validate } from '../middleware/auth.middleware.js';
import * as Login from '../controllers/user.controller.js';

const rootRouter = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Public routes (no auth)
rootRouter.post("/login", Login.userLogin);
rootRouter.post("/login/register", Login.userRegister);
rootRouter.post("/refresh", Login.userRefresh);

// Auth wall — everything below requires valid token
rootRouter.use(validate);

// Auto-mount sub-routers
for (const file of readdirSync(__dirname)) {
  if (!file.endsWith(".routes.js") || file === "index.js") continue;
  try {
    const mod = await import(join(__dirname, file));
    const subRouter = mod.default ?? mod;
    const routeName = file.replace(".routes.js", "");
    rootRouter.use(`/${routeName}`, subRouter);
    console.log(`[Route Loaded]: /${routeName} -> ${file}`);
  } catch (err) {
    console.error(`[Route Error]: Could not load "${file}": ${err.message}`);
  }
}

export default rootRouter;
