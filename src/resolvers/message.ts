import Message from '../models/message';
import User from '../models/user';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';
import pubsub, { messageEvent } from '../subscription';
import { NotFoundError } from '../errors';

export default {
  Query: {
    message: async (parent, { id }, { me }) => {
      const message = await Message.findByPk(id);
      if (!message) {
        throw new NotFoundError({ message: '未找到消息' });
      }
      return message;
    },
    messages: async (parent, { limit }, { me }) => {
      const { rows, count } = await Message.findAndCountAll({
        limit: limit,
      });
      if (!rows || rows.size < 1) {
        throw new NotFoundError({ message: '未找到消息' });
      }
      return {
        collections: rows,
        total_num: count,
      };
    },
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me }) => {
        const message = await Message.create({
          text,
          userId: me.id,
        });

        pubsub.publish(messageEvent.CREATED, {
          messageCreated: { message },
        });

        return message;
      }
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { me }) => {
        return await Message.destroy({
          where: {
            id,
          },
        });
      }
    ),
  },

  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(messageEvent.CREATED),
    },
  },

  Message: {
    user: async (message: Message, args, { me }) => {
      const user = await User.findByPk(message.userId);
      return user;
    },
  },
};
