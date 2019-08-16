// import { GraphQLDate } from 'graphql-iso-date';
import userResolvers from './user';
import messageResolvers from './message';
import { TimestampType } from '../schema/timestamp';

const customScalarResolver = {
  Date: TimestampType,
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
];
