import { ApolloError } from 'apollo-server-express';
import { ErrorConstructorParam } from './interfaces';

export class AuthenticationError extends ApolloError {
  constructor(
    param?: ErrorConstructorParam,
    properties?: Record<string, any>
  ) {
    const code = (param && param.code) || 'Authentication';
    const errorCode = (param && param.errorCode) || 10010;
    const message = (param && param.message) || '认证失败';
    super(message, code);
    this.extensions = {
      code: code,
      error_code: errorCode,
      ...properties,
    };

    Object.defineProperty(this, 'name', {
      value: 'AuthenticationError',
    });
  }
}
