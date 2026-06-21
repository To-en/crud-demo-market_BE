import Jwt from "jsonwebtoken";
import model from "../models";
import config from "../config.js";

// Sign Access token
export async function signAccessToken(userId,role) {
  return Jwt.sign(
      { id: dbUser.id, role },
      config.jwtsecret.access,
      { expiresIn: config.jwtsecret.accessExpire * 60 }
    );
}
// Signs refreshToken, saves to DB, returns it
export async function signRefreshToken(userId, role) {
  const refreshToken = Jwt.sign(
    { id: userId, role },
    config.jwtsecret.refresh,
    { expiresIn: config.jwtsecret.refreshExpire * 60 }
  );
  await model.User.update({ refreshToken }, { where: { id: userId } });
  return refreshToken;
}

// Role assignment based on username pattern
export function assignRole(username) {
  if (username.endsWith('@ra-personel.ac.th')) return 1;  // Admin/Teacher
  if (/^[A-Za-z0-9]+-\d+-group\d+$/.test(username)) return 0;  // Student
    // the desired format was {P or M}{1-6}-group{number}
  return null;  // unknown -> reject
}
