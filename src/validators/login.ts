import { Length } from 'class-validator';
import BaseValidator from './base';

export default class LoginValidator extends BaseValidator {
  @Length(1, 20, { message: '登陆名长度必须在1~20字符之间' })
  login!: string;

  @Length(1, 20, { message: '密码长度必须在1~20字符之间' })
  password!: string;
}
