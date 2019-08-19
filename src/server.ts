import express from 'express';
import http from 'http';
import cors from 'cors';
import schema from './schema';
import resolvers from './resolvers';
import { getMe } from './libs/token';
import { ApolloServer, ValidationError } from 'apollo-server-express';

const app = express();

app.use(cors());

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  debug: true,
  formatError: error => {
    // data, errors are the only top-level fields
    // and extensions are on the bottom of errors
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

export { httpServer };
