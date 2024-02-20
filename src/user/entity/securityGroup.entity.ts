import {
  Table,
  PrimaryKey,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { ObjectType, Field } from 'type-graphql';
import { User } from './user.entity';

@Table({ tableName: 'SecurityGroup' })
@ObjectType()
export class SecurityGroub extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  @Field()
  id: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  @Field(() => [String])
  premissons: string[];

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
