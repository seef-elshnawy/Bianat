import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Model,
  DataType,
  ForeignKey,
  Table,
  HasOne,
  PrimaryKey,
} from 'sequelize-typescript';
import { User } from 'src/user/entity/user.entity';

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

  @Column({
    type: DataType.UUID,
  })
  @ForeignKey(() => User)
  @Field(() => String)
  userId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  @Field(() => Boolean)
  isReply: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  @Field(() => Boolean)
  isRetweet: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  @Field(() => Array(String))
  replies: string[];

  @Column({
    type: DataType.STRING,
  })
  @Field(() => String)
  retweet: string;

  @HasOne(() => User, 'userId')
  user: User;
}
