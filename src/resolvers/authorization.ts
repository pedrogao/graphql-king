import { ForbiddenError } from '../errors';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>
  me
    ? skip
    : new ForbiddenError({ message: '用户未被授权，禁止访问' });

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => {
    role === 'ADMIN'
      ? skip
      : new ForbiddenError({ message: '您还不是管理员，不可操作' });
  }
);
