import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AuthDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}
