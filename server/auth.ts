import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { User, getDatabase } from './db.ts';

const SECRET_FILE = path.resolve(process.cwd(), 'data', '.jwt_secret');

function getOrGenerateJwtSecret(): string {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) {
    return process.env.JWT_SECRET;
  }
  try {
    if (fs.existsSync(SECRET_FILE)) {
      const secret = fs.readFileSync(SECRET_FILE, 'utf-8').trim();
      if (secret.length >= 16) return secret;
    }
  } catch (e) {
    // ignore
  }

  const generated = crypto.randomBytes(32).toString('hex');
  try {
    const dataDir = path.dirname(SECRET_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(SECRET_FILE, generated, 'utf-8');
  } catch (e) {
    // ignore write error
  }
  return generated;
}

const JWT_SECRET = getOrGenerateJwtSecret();

export interface AuthenticatedUserPayload {
  userId: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

export function generateToken(user: User): string {
  const payload: AuthenticatedUserPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthenticatedUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthenticatedUserPayload;
  } catch (err) {
    return null;
  }
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing or malformed token.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const decoded = verifyToken(token);

  if (!decoded || decoded.role !== 'admin') {
    res.status(403).json({ error: 'Access denied. Valid administrator credentials required.' });
    return;
  }

  // Also verify user still exists in database
  const db = getDatabase();
  const userExists = db.users.some(u => u.id === decoded.userId && u.email.toLowerCase() === decoded.email.toLowerCase());
  if (!userExists) {
    res.status(403).json({ error: 'User account has been revoked or removed.' });
    return;
  }

  req.user = decoded;
  next();
}
