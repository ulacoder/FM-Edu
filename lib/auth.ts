import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'eduai_kz_secret_key_2026_hackathon';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, role: UserRole): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; role: UserRole } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getUserFromToken(token?: string): { userId: string; role: UserRole } | null {
  if (!token) return null;

  // Убираем Bearer если есть
  const cleanToken = token.replace('Bearer ', '');
  return verifyToken(cleanToken);
}
