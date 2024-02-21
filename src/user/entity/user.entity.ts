import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  DataType,
  PrimaryKey,
  Model,
  Table,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { enumColumn } from 'src/common/utils/utils';
import { OTP } from 'src/otp/model/otp.model';
import { Role } from '../user.enum';
import { SecurityGroub } from './securityGroup.entity';
import { Files } from './files.entity';
import { Tweets } from 'src/tweets/entities/tweet.entity';

@Table({ tableName: 'User' })
@ObjectType()
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Field()
  id: string;

  @Column({ type: DataType.STRING })
  @Field()
  fullName: string;

  @Column
  @Field()
  age: number;

  @Column({ type: DataType.STRING })
  password: string;

  @AllowNull
  @Column({ type: DataType.STRING })
  @Field({ nullable: true })
  validEmail: string;

  @AllowNull
  @Column({ type: DataType.STRING })
  @Field({ nullable: true })
  invalidEmail: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  @Field(() => Array(String))
  Followers: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  @Field(() => Array(String))
  Followings: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  @Field(() => Array(String))
  Hobbies: string[];

  @HasMany(() => OTP, 'userId')
  otp: OTP[];

  @HasOne(() => SecurityGroub, 'userId')
  SecurityGroup: SecurityGroub;

  @HasMany(() => Files, 'userId')
  Files: Files[];

  @HasMany(() => Tweets, 'userId')
  tweets: Tweets[];
}
