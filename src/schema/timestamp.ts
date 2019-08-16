/** Kind is an enum that describes the different kinds of AST nodes. */
import { Kind } from 'graphql/language';
import { GraphQLScalarType } from 'graphql';

const TimestampType = new GraphQLScalarType({
  name: 'Timestamp',
  serialize(date) {
    return date instanceof Date ? date.getTime() : null;
  },
  parseValue(value) {
    try {
      return new Date(value);
    } catch (error) {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    } else if (ast.kind === Kind.STRING) {
      // @ts-ignore
      const tmp = this.parseValue(ast.value);
      return tmp;
    } else {
      return null;
    }
  },
});

export { TimestampType };
