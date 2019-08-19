import { sequelize } from './models';
import User from './models/user';
import Message from './models/message';
import { httpServer } from './server';

const run = async ({ force, port }) => {
  sequelize.sync({ force: force }).then(async () => {
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
      console.log(`listening at http://localhost:${port}/graphql`);
    });
  });
};

const port = process.env.SERVER_PORT || 3000;
const force = process.env.DATABASE_FORCE || true;

run({ force, port });
