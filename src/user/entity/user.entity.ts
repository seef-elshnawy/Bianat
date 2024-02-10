import { Field, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  DataType,
  PrimaryKey,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { OTP } from 'src/otp/model/otp.model';

@Table({ tableName: 'User' })
@ObjectType()
export class User extends Model{
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

  @HasMany(() => OTP, 'userId')
  otp: OTP[];
}
