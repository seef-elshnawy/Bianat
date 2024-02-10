import { OtpUseCase } from '../otp.enum';
import { enumColumn } from 'src/common/utils/utils';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  PrimaryKey,
  ForeignKey,
  HasOne,
  BelongsTo,
  Column,
  DataType,
  Table,
  Model,
} from 'sequelize-typescript';

import { User } from 'src/user/entity/user.entity';

@Table({ tableName: 'OTP' })
@ObjectType()
export class OTP extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Field()
  id: string;
  @Column({ type: enumColumn(OtpUseCase) })
  useCase: OtpUseCase;

  // @ForeignKey(() => User)
  @Column
  userId: string;

  @Column({ type: DataType.STRING })
  @Field()
  OTPCode: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW(),
  })
  createdAt?: Date;
  @Column({
    type: DataType.DATE,
  })
  expiration?: number;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  valide: any;

  @BelongsTo(() => User, 'userId')
  user: User;
}
