import { Provider } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export const PubServiceProvider: Provider = {
  provide: 'PUBSERVICE',
  useFactory: () => {
    return new PubSub();
  },
};
