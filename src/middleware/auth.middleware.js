import Jwt from 'jsonwebtoken';
import config from '../config.js';
import model from '../models/index.js';
import makeLogger from '../logger.js';

const logger = makeLogger(import.meta.url);

export async function validate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    logger.debug("missing/malformed Authorization header on %s", req.originalUrl);
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (process.env.NODE_ENV === 'development' && token === process.env.DEV_TOKEN) {
    logger.warn("DEV_TOKEN auth bypass used on %s", req.originalUrl);
    req.user = { id: 1, role: 2, class: null };
    return next();
  }
  try {
    const jwt = Jwt.verify(token, config.jwtsecret.access);
    const user = await model.User.findByPk(jwt.id);
    if (!user) {
      logger.warn("valid token but user %s not found", jwt.id);
      return res.status(403).json({ error: "User not found" });
    }
    req.user = user.get({ plain: true });
    delete req.user.password;
  } catch (err) {
    logger.debug("access token rejected: %s", err.message);
    return res.status(403).json({ error: "Invalid access token" });
  }

  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn("user %s (role %s) denied — needs %j on %s", req.user.id, req.user.role, roles, req.originalUrl);
      return res.status(403).json({ error: 'Your role has no access' });
    }
    next();
  };
}

