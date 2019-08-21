import { NotFoundError } from '../src/errors';

test('异常的构造函数', async () => {
  const e = new NotFoundError({ message: 'hello' });
  expect(e.message).toBe('hello');
});
