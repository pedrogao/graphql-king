import { Model, STRING, INTEGER } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from './index';

export default class User extends Model {
  id!: number;
  username!: string;
  email!: string;
  password!: string;

  role!: string;

  generatePasswordHash(value: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(value, saltRounds);
  }

  validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  static async findByLogin(login: string): Promise<User> {
    let user = await User.findOne({
      where: {
        username: login,
      },
    });
    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }
    return user;
  }
}

User.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 80],
      },
      set(ps) {
        const saltRounds = 10;
        const hashed = bcrypt.hashSync(ps, saltRounds);
        // @ts-ignore
        this.setDataValue('password', hashed);
      },
      get() {
        // @ts-ignore
        return this.getDataValue('password');
      },
    },
    role: {
      type: STRING,
    },
  },
  {
    modelName: 'user',
    tableName: 'user',
    sequelize,
  }
);

// User.beforeCreate(async user => {
//   console.log(user.password);
// });
