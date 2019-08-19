import { Sequelize } from 'sequelize';

/**
 * 目前demo为开发环境下，故选择了本地的sqlite数据库，
 * 其它环境下建议选择诸如mysql,postgres等远程可用的数据库
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

export { sequelize };
