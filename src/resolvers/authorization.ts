import { ForbiddenError } from '../errors';
import { combineResolvers, skip } from 'graphql-resolvers';
import { getMe } from '../libs/token';

export const loginRequired = async (parent, args, context, info) => {
  const { req } = context;
  const me = await getMe(req);
  me
    ? skip
    : new ForbiddenError({ message: '用户未被授权，禁止访问' });
  context.me = me;
};

export const isAdmin = combineResolvers(
  loginRequired,
  (parent, args, { me: { role } }) => {
    role === 'ADMIN'
      ? skip
      : new ForbiddenError({ message: '您还不是管理员，不可操作' });
  }
);
