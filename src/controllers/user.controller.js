import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config.js';
import models from '../models/index.js';
import * as service from '../services/user.service.js';
import { distributeBudget } from '../services/budget.service.js';


// POST /api/login
export async function userLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  try {
    const dbUser = await models.User.findOne({ where: { username } });
    if (!dbUser)
      return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, dbUser.password);
    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    const role = service.assignRole(username);
    if (role === null)
      return res.status(403).json({ error: "Account type not recognized" });

    const accessToken  = service.signAccessToken(dbUser.id, role);
    const refreshToken = await service.signRefreshToken(dbUser.id, role);

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
}


// POST /api/refresh
// use refresh token to revoke for access token
export async function userRefresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ error: "refreshToken required" });

  try {
    const payload = Jwt.verify(refreshToken, config.jwtsecret.refresh);
    const dbUser = await models.User.findOne({
      where: { id: payload.id, refreshToken }
    });
    if (!dbUser)
      return res.status(401).json({ error: "Invalid or revoked refresh token" });

    const accessToken = service.signAccessToken(dbUser.id, dbUser.role);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: "Refresh token expired or invalid" });
  }
}


// POST /api/login/register  (no UI — admin registers users manually)
export async function userRegister(req, res) {
  const { username, password, classroom } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  try {
    // Assign role and class
    const role = service.assignRole(username);
    if (role === null)
      return res.status(400).json({ error: "Username format not recognized" });

    const hashed = await bcrypt.hash(password, 10);
    await models.User.create({
      username,
      password: hashed,
      class:classroom,
      role
    });

    res.status(201).json({ status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
}


// POST /api/distribute-budget  (admin only, role 2)
export async function triggerDistribute(req, res) {
  const { departmentId } = req.body;
  if (!departmentId || isNaN(departmentId))
    return res.status(400).json({ error: "departmentId (number) required" });

  try {
    const result = await distributeBudget(Number(departmentId));
    res.status(200).json({ status: 200, ...result });
  } catch (err) {
    console.error('Distribute error:', err);
    res.status(500).json({ error: "Failed to distribute budget" });
  }
}
