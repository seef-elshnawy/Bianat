import { Field } from '@nestjs/graphql';
import {
  Column,
  DataType,
  PrimaryKey,
  Model,
  ForeignKey,
  BelongsTo,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({ tableName: 'Files' })
export class Files extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  fileLink: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  userId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isActive: boolean;

  @BelongsTo(() => User, 'userId')
  user: User;
}
