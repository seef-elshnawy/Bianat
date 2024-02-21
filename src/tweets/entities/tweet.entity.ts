import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Model,
  DataType,
  ForeignKey,
  Table,
  HasOne,
  PrimaryKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';
import { Hashtag } from './hashtag.entity';
import { TweetHashtag } from './tweetHash.entity';

@Table({ tableName: 'Tweets' })
@ObjectType()
export class Tweets extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Field(() => String)
  id: string;

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  tweet: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @Column({
    type: DataType.UUID,
  })
  @ForeignKey(() => Tweets)
  @Field(() => String)
  parentReply: string;

  @Column({
    type: DataType.UUID,
  })
  @ForeignKey(() => Tweets)
  @Field(() => String)
  retweet: string;
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  @Field(() => Array(String))
  replies: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  @Field(() => Array(String))
  Tweet_Images: string[];

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Tweets, { foreignKey: 'parentReply', as: 'Reply' })
  parent: Tweets;

  @BelongsTo(() => Tweets, { foreignKey: 'retweet', as: 'parentRetweet' })
  parentRetweet: Tweets;

  @BelongsToMany(() => Hashtag, () => TweetHashtag)
  HashTags: Hashtag[];
}
