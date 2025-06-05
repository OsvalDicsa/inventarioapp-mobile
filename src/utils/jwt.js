import { Buffer } from 'buffer';

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function isJwtExpired(token) {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }
  const expiry = payload.exp * 1000;
  return Date.now() >= expiry;
}
