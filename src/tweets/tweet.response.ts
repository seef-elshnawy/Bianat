import { ObjectType } from '@nestjs/graphql';
import { staticRespone } from 'src/common/utils/responseType';
import { Tweets } from './entities/tweet.entity';

@ObjectType()
export class TweetStringResponse extends staticRespone(String) {}

@ObjectType()
export class TweetsResponse extends staticRespone(Array(Tweets)) {}

@ObjectType()
export class TweetResponse extends staticRespone(Tweets) {}
