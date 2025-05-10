import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'changeme';

export function gerarToken(payload: object, expiresIn = '7d'): string {
  const signOptions: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, signOptions);
}

export function verificarToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
