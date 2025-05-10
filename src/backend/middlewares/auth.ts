import type { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { id: number; email: string; admin: boolean };
}

export function autenticarJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = verificarToken(token) as { id: number; email: string; admin: boolean };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

export function apenasAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.admin) {
    return res.status(403).json({ error: 'Acesso restrito à administração.' });
  }
  next();
}
