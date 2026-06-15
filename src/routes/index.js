import { Router } from 'express';
import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootRouter = Router();

const files = readdirSync(__dirname).filter(f => f.endsWith('.routes.js'));

for (const file of files) {
  try {
    const mod = await import(pathToFileURL(join(__dirname, file)).href);
    const subRouter = mod.default;

    if (subRouter && (typeof subRouter === 'function' || typeof subRouter.use === 'function')) {
      const routeName = file.replace('.routes.js', '');
      rootRouter.use(`/${routeName}`, subRouter);
      console.log(`[Route Loaded]: /${routeName} -> ${file}`);
    } else {
      console.warn(`[Route Warning]: "${file}" did not export a valid Router`);
    }
  } catch (err) {
    console.error(`[Route Error]: failed to load "${file}": ${err.message}`);
  }
}

export default rootRouter;
