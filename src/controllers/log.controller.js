import { readFile } from 'fs/promises';
import path from 'path';
import makeLogger from '../logger.js';

const logger = makeLogger(import.meta.url);

// Whitelist — never let the client name an arbitrary path (traversal guard)
const FILES = { combined: 'combined.log', error: 'error.log' };

// GET /api/log?file=combined|error&lines=200 → tail of a backend log file (admin only)
export async function tailLog(req, res) {
  const file = FILES[req.query.file] ? req.query.file : 'combined';
  const lines = Math.min(1000, Math.max(1, parseInt(req.query.lines) || 200));

  try {
    const full = path.join(process.cwd(), 'logs', FILES[file]);
    const text = await readFile(full, 'utf8');
    const tail = text.split('\n').filter(Boolean).slice(-lines);
    res.status(200).json({ file, count: tail.length, lines: tail });
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(200).json({ file, count: 0, lines: [] });
    logger.error("tailLog %s failed: %s", file, error.message);
    res.status(500).json({ error: "Failed to read log file" });
  }
}
