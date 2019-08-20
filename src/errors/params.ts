import { ApolloError } from 'apollo-server-express';
import { ErrorConstructorParam } from './interfaces';

export class ParamError extends ApolloError {
  constructor(
    param?: ErrorConstructorParam,
    properties?: Record<string, any>
  ) {
    const code = (param && param.code) || 'Param';
    const errorCode = (param && param.errorCode) || 10040;
    const message = (param && param.message) || '参数错误';
    super(message, code);
    this.extensions = {
      code: code,
      error_code: errorCode,
      ...properties,
    };

    Object.defineProperty(this, 'name', { value: 'ParamError' });
  }
}
