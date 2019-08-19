import { ApolloError } from 'apollo-server-express';
import { ErrorConstructorParam } from './interfaces';

export class NotFoundError extends ApolloError {
  constructor(
    param?: ErrorConstructorParam,
    properties?: Record<string, any>
  ) {
    const code = (param && param.code) || 'NotFound';
    const errorCode = (param && param.errorCode) || 10020;
    const message = (param && param.message) || '未找到资源';
    super(message, code);
    this.extensions = {
      code: code,
      error_code: errorCode,
      ...properties,
    };

    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}
