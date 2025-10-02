import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '@/models/User';

import { config } from '@/lib/config';

const JWT_SECRET = config.auth.jwtSecret;

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  exp?: number;
  iat?: number;
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    return decoded as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookies
  const token = req.cookies?.token;
  return token || null;
}

export function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader('Set-Cookie', [
    `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure=${config.auth.cookieSecure}`
  ]);
}

export function clearTokenCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure'
  ]);
}

export function getCurrentUser(req: NextApiRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  
  return verifyToken(token);
}

// Client-side helper to check if user is logged in
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  if (!token) return false;
  
  try {
    const payload = jwt.decode(token) as JWTPayload;
    return Boolean(payload && payload.exp && payload.exp > Date.now() / 1000);
  } catch {
    return false;
  }
}

// Client-side helper to get user info from token
export function getCurrentUserFromToken(): JWTPayload | null {
  if (typeof window === 'undefined') return null;
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  if (!token) return null;
  
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
