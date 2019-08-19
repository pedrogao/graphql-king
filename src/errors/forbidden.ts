import { ApolloError } from 'apollo-server-express';
import { ErrorConstructorParam } from './interfaces';

export class ForbiddenError extends ApolloError {
  constructor(
    param?: ErrorConstructorParam,
    properties?: Record<string, any>
  ) {
    const code = (param && param.code) || 'Forbidden';
    const errorCode = (param && param.errorCode) || 10030;
    const message = (param && param.message) || '禁止操作';
    super(message, code);
    this.extensions = {
      code: code,
      error_code: errorCode,
      ...properties,
    };

    Object.defineProperty(this, 'name', { value: 'ForbiddenError' });
  }
}
