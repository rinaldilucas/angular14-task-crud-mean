import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import redis from '@api/utils/redis.handler';

const existsAsync = promisify(redis.exists).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
const generateTokenHash = (token: any): any => {
  return createHash('sha256').update(token).digest('hex');
};

export const add = async (token: string): Promise<any> => {
  if (token) {
    const expirationDate = (jwt as any).decode(token).exp;
    const tokenHash = generateTokenHash(token);
    await setAsync(tokenHash, '');
    (redis as any).expireat(tokenHash, expirationDate);
  }
};

export const hasToken = async (token: string): Promise<any> => {
  const tokenHash = generateTokenHash(token);
  const result = await existsAsync(tokenHash);
  return result === 1;
};

export const verifyBlacklistForToken = async (token: string): Promise<any> => {
  const isTokenBlacklisted = await hasToken(token);
  if (isTokenBlacklisted) return true;
  else return false;
};
