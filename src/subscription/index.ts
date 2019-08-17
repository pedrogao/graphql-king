import { PubSub } from 'apollo-server-express';

import * as messageEvent from './message';

export { messageEvent };

export default new PubSub();
