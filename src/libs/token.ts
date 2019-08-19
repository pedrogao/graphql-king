import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Request } from 'express';
import { secret } from '../config';
import { AuthenticationError } from '../errors';

export interface ParsedToken {
  id: number;
  email: string;
  username: string;
  role: string;
}

export const createToken = async (
  user: User,
  secret: string,
  expiresIn: string
) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn: expiresIn,
  });
};

export const getMe = async (req: Request) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const decoded = await jwt.verify(token as string, secret);
      return decoded as ParsedToken;
    } catch (e) {
      throw new AuthenticationError({
        message: '令牌过期，请重新登陆',
      });
    }
  }
};
