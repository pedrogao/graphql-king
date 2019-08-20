import { validateSync } from 'class-validator';
import { ParamError } from '../errors';

export default class BaseValidator {
  constructor(args) {
    const keys = Object.keys(args);
    for (const key of keys) {
      this[key] = args[key];
    }
  }

  async validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      // @ts-ignore
      throw new ParamError({
        message: Object.values(errors[0].constraints)[0],
      });
    }
    return this;
  }
}
