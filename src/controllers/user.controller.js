import bcrypt from 'bcrypt';
import config from '../config.js';
import models from '../models/index.js';
import * as service from '../services/user.service.js';

// POST /api/login
export async function userLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'username and password required' });

  try {
    const dbUser = await models.User.findOne({ where: { username } });
    if (!dbUser)
      return res.status(401).json({ error: 'Invalid credentials' });

    // Condition check password if matched with bcrypt
    const match = await bcrypt.compare(password, dbUser.password);
    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' });

    const role = service.assignRole(username);
    if (role === null)
      return res.status(403).json({ error: 'Account type not recognized' });

    // Sign

    const accessToken = await service.signAccessToken(dbUser.id, role)
    const refreshToken = await service.signRefreshToken(dbUser.id, role);

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/refresh
export async function userRefresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ error: 'refreshToken required' });

  try {
    const payload = Jwt.verify(refreshToken, config.jwtsecret.refresh);
    const dbUser = await models.User.findOne({
      where: { id: payload.id, refreshToken }
    });
    if (!dbUser)
      return res.status(401).json({ error: 'Invalid or revoked refresh token' });

    const accessToken = Jwt.sign(
      { id: dbUser.id, role: dbUser.role },
      config.jwtsecret.access,
      { expiresIn: config.jwtsecret.accessExpire * 60 }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Refresh token expired or invalid' });
  }
}

// POST /api/login/register  (admin only, no UI)
export async function userRegister(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'username and password required' });

  try {
    const role = service.assignRole(username);
    if (role === null)
      return res.status(400).json({ error: 'Username format not recognized' });

    // Hash password with bcrypt with salt = 10
    const hashed = await bcrypt.hash(password, 10);
    await models.User.create({ username, password: hashed, role });

    res.status(201).json({ status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
  
}

// ---- (Admin and Teacher side controller) + There will be no frontend UI for this
// GET
export async function InjectBudget(req,res) {
  // Must authenticate as role = 1 only 
  if(model.User != 1) return console.log("Budget management is not accessible with your role");

    try {
      
    } catch (error) {
      
    }


  
  // invokes payment service from order.service
  // pays for all ingredient of the order in bulk
  
  // Use the number of budget given to user convert to payment
  
  // Call servivce to handle payment

  // Call service to redistribute budget equally for all registered user
  // That means we need to count , divide , floor down to nearest integer

}



