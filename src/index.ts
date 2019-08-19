import { sequelize } from './models';
import User from './models/user';
import Message from './models/message';
import { httpServer } from './server';
import { config } from './libs/config';

(() => {
  config.getConfigFromFile('src/config/application.json');
  config.getConfigFromEnv();
})();

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

const port = config.getItem('port') || 3000;
const force = config.getItem('force') || true;

run({ force, port });
