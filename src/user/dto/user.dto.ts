import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UserDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  fullName: string;
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  age: number;
}
