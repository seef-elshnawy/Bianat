import { Column, DataType, ForeignKey, Table,Model } from 'sequelize-typescript';
import { Tweets } from './tweet.entity';
import { Hashtag } from './hashtag.entity';

@Table
export class TweetHashtag extends Model {
  @ForeignKey(() => Tweets)
  @Column({ type: DataType.UUID })
  tweetId: string;

  @ForeignKey(() => Hashtag)
  @Column({ type: DataType.UUID })
  hashtagId: string;
}
