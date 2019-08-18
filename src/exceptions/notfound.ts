import { ApolloError } from 'apollo-server-express';

export class NotFoundError extends ApolloError {
  constructor(message: string, properties?: Record<string, any>) {
    const code = 'NotFound';
    const errorCode = 10000;
    super(message, code);
    this.extensions = {
      code: code,
      error_code: errorCode,
      ...properties,
    };

    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}
