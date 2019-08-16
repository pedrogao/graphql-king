import Koa from 'koa';
import http from 'http';
import { sequelize } from './models';
import User from './models/user';
import Message from './models/message';
import schema from './schema';
import resolvers from './resolvers';
import { secret } from './config';
import { ApolloServer, AuthenticationError } from 'apollo-server-koa';
import jwt from 'jsonwebtoken';

const app = new Koa();

const port = process.env.SERVER_PORT || 3000;

export interface ParsedToken {
  id: number;
  email: string;
  username: string;
  role: string;
}

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, secret);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.'
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  debug: true,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
    // console.log(JSON.stringify(error, null, '  '));
    // return {
    //   ...error,
    //   message,
    // };
    let code = error.extensions && error.extensions.code;
    return {
      message,
      code: code || 999,
    };
  },
  formatResponse: res => {
    // console.log(JSON.stringify(res, null, '  '));
    return res;
  },
  context: async ({ ctx, connection }) => {
    if (connection) {
      // 支持websocket等长链接
      return {};
    }
    if (ctx) {
      const { req } = ctx;
      const me = await getMe(req);
      return {
        me,
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app.callback());

server.installSubscriptionHandlers(httpServer);

sequelize.sync({ force: true }).then(async () => {
  const user = await User.create({
    username: 'pedro',
    password: '123456',
    email: '1312342604@qq.com',
    role: 'ADMIN',
  });
  await Message.create({
    userId: user.id,
    text: 'greeting from pedro',
  });

  httpServer.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });
});
