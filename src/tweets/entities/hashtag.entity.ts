import { Field, ObjectType } from '@nestjs/graphql';
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Tweets } from './tweet.entity';
import { TweetHashtag } from './tweetHash.entity';

@Table({ tableName: 'Hashtag' })
@ObjectType()
export class Hashtag extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Field(() => String)
  id: string;

  @Column({ type: DataType.STRING })
  @Field(() => String)
  HashTag: string;
  @BelongsToMany(() => Tweets, () => TweetHashtag)
  tweets: Tweets[];
}
