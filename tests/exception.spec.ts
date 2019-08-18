import { NotFoundError } from '../src/exceptions/notfound';

const e = new NotFoundError('未找到', {
  error_code: 10000,
});

console.log(e);
