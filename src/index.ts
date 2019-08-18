import express, { Request } from 'express';
import http from 'http';
import cors from 'cors';
import { sequelize } from './models';
import User from './models/user';
import Message from './models/message';
import schema from './schema';
import resolvers from './resolvers';
import { secret } from './config';
import {
  ApolloServer,
  AuthenticationError,
  ValidationError,
} from 'apollo-server-express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors());

const port = process.env.SERVER_PORT || 3000;

export interface ParsedToken {
  id: number;
  email: string;
  username: string;
  role: string;
}

const getMe = async (req: Request) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const decoded = await jwt.verify(token as string, secret);
      return decoded as ParsedToken;
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
  debug: false,
  formatError: error => {
    // data, errors, and extensions are the only top-level fields
    // const message = error.message
    //   .replace('SequelizeValidationError: ', '')
    //   .replace('Validation error: ', '');
    // error.message = message;
    if (
      error instanceof ValidationError ||
      error.originalError instanceof ValidationError
    ) {
      error.extensions!.error_code = 10000;
      return error;
    }
    if (error.extensions) {
      if (!error.extensions.error_code) {
        error.extensions.error_code = 9999;
        return error;
      }
    } else {
      // @ts-ignore
      error.extensions = {
        error_code: 9999,
        code: 'UNKNOWN',
      };
      return error;
    }
    return error;
  },
  formatResponse: res => {
    // console.log(JSON.stringify(res, null, '  '));
    return res;
  },
  context: async ({ req, connection }) => {
    if (connection) {
      // 支持websocket等长链接
      return {};
    }
    if (req) {
      const me = await getMe(req);
      return {
        me,
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);

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
