import { Model, STRING, INTEGER } from 'sequelize';
import { sequelize } from './index';

export default class Message extends Model {
  id!: number;
  text!: string;
  userId!: number;
}

Message.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    text: {
      type: STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    modelName: 'message',
    tableName: 'message',
    sequelize,
  }
);
