import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import {
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express';
import User from '../models/user';
import { isAuthenticated, isAdmin } from './authorization';
import { secret, expiresIn } from '../config';
import Message from '../models/message';

const createToken = async (
  user: User,
  secret: string,
  expiresIn: string
) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn: expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, args, { me }, info): Promise<User[]> => {
      const users = await User.findAll();
      return users;
    },
    user: async (parent, { id }, { me }): Promise<User> => {
      const user = await User.findByPk(id);
      return user;
    },
    me: async (parent, args, { me }) => {
      if (!me) {
        return null;
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
        throw new UserInputError(
          'No user found with this login credentials.'
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
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
