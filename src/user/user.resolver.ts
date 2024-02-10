import {
  Args,
  Context,
  Mutation,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './uesr.service';
import { User } from './entity/user.entity';
import { UserDto } from './dto';
import { CurrentUser } from 'src/auth/decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuards } from 'src/auth/guerd';
import { AuthDto } from 'src/auth/dto/Auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import {
  staticResponseMessage,
  staticResponseUser,
  staticResponseUsers,
} from './Response';

@Resolver(User)
// @UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Query(() => staticResponseUsers)
  async getAllUser(@Args('page') page: number): Promise<staticResponseUsers> {
    return await this.userService.getAllUser(page);
  }
  @UseGuards(AuthGuards)
  @Query(() => staticResponseUser)
  async whoIAM(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => staticResponseUser)
  async removeUser(@Args('id') id: string) {
    return await this.userService.removeUser(id);
  }
  @Mutation(() => staticResponseUser)
  async signUp(@Args('input', { type: () => UserDto }) data: UserDto) {
    return this.authService.signUp(data);
  }
  @Mutation(() => staticResponseUser)
  async updateUser(
    @Args('userId', { type: () => String }) id: string,
    @Args({ name: 'input', type: () => UserDto }) data: UserDto,
  ) {
    return await this.userService.updateUser(id, data);
  }

  @Mutation(() => staticResponseUser)
  async signIn(@Args('input', { type: () => AuthDto }) data: AuthDto) {
    console.log(data);
    const user = await this.authService.signIn(data);
    return user;
  }
  @Mutation(() => staticResponseMessage)
  async enterOTP(@Args('code', { type: () => Number }) code: number) {
    return await this.userService.validateOtp(code);
  }
  @Mutation(() => staticResponseMessage)
  async ForgetPassword(@Args('email', { type: () => String }) email: String) {
    return await this.userService.ForgetPassword(email);
  }
  @Mutation(() => staticResponseMessage)
  async ResetPassword(
    @Args('password', { type: () => String }) password: string,
    @Args('confirmPassword', { type: () => String }) confirmPassword: string,
    @Context('req') request: Request,
  ) {
    const tokenJwt = request.headers.authorization;
    const token = tokenJwt.split('Bearer ')[1];
    return await this.userService.ResetPassword(
      password,
      confirmPassword,
      token,
    );
  }

  // @ResolveField()
  // hasPassword(@Parent() user: User) {
  //   return !!user.password;
  // }
}
