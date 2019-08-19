import { combineResolvers } from 'graphql-resolvers';
import User from '../models/user';
import { isAuthenticated, isAdmin } from './authorization';
import { config } from '../libs/config';
import Message from '../models/message';
import { NotFoundError, AuthenticationError } from '../errors';
import { createToken } from '../libs/token';

const secret = config.getItem('secret');
const expiresIn = config.getItem('expiresIn');

export default {
  Query: {
    users: async (parent, args, { me }, info): Promise<User[]> => {
      const users = await User.findAll();
      return users;
    },
    user: async (parent, { id }, { me }): Promise<User> => {
      const user = await User.findByPk(id);
      if (!user) {
        throw new NotFoundError({ message: '未找到用户' });
      }
      return user;
    },
    me: async (parent, args, { me }) => {
      if (!me) {
        throw new NotFoundError({ message: '未找到用户' });
      }
      return await User.findByPk(me.id);
    },
  },

  Mutation: {
    signUp: async (parent, { username, email, password }, { me }) => {
      const user = await User.create({
        username,
        email,
        password,
      });
      return {
        token: createToken(user, secret, expiresIn),
      };
    },

    signIn: async (parent, { login, password }, { me }) => {
      const user = await User.findByLogin(login);
      if (!user) {
        throw new NotFoundError({
          message: '用户不存在，请检查登陆用户名或登陆邮箱',
        });
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError({
          message: '输入密码错误，请检查后重新输入',
        });
      }

      return { token: createToken(user, secret, expiresIn) };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { me }) => {
        const user: User = await User.findByPk(me.id);
        return await user.update({ username });
      }
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { me }) => {
        return await User.destroy({
          where: { id },
        });
      }
    ),
  },

  User: {
    messages: async (user, args, { me }) => {
      return await Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
    tips: async (user, args, { me }) => {
      return ['满100减90', '心动不如心动'];
    },
  },
};
