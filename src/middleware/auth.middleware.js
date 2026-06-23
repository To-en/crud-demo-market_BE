import Jwt from 'jsonwebtoken';
import config from '../config.js';
import model from '../models/index.js';

export async function validate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];

  if (process.env.NODE_ENV === 'development' && token === process.env.DEV_TOKEN) {
    req.user = { id: 1, role: 2, class: null };
    return next();
  }
  try {
    const jwt = Jwt.verify(token, config.jwtsecret.access);
    const user = await model.User.findByPk(jwt.id);
    if (!user)
      return res.status(403).json({ error: "User not found" });
    req.user = user.get({ plain: true });
    delete req.user.password;
  } catch (err) {
    return res.status(403).json({ error: "Invalid access token" });
  }

  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: 'Your role has no access' });
    next();
  };
}

