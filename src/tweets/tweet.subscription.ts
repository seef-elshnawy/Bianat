import { Resolver, Subscription } from '@nestjs/graphql';
import { Tweets } from './entities/tweet.entity';
import { TweetsResponse } from './tweet.response';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'type-graphql';

@Resolver()
export class tweetSubResolver {
  constructor(@Inject('PUBSERVICE') private readonly pubSub: PubSubEngine) {}
  //   @Subscription(() => TweetsResponse)
  //   async addTweets() {
  //     return this.pubSub.asyncIterator('tweet_added');
  //   }
}
