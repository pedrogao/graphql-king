import { gql } from 'apollo-server-express';
import { readFileSync } from 'fs';

export default gql(
  readFileSync(__dirname.concat('/user.graphql'), 'utf8')
);
