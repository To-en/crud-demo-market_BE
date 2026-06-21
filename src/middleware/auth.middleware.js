import Jwt from 'jsonwebtoken';
import config from '../config.js';
import model from '../models/index.js';

export async function validate(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
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
