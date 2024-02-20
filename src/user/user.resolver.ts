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
import { Bind, UseGuards } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/Auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { UserGuard } from './guard';
import { AuthGuards } from 'src/auth/guerd';
import { HelperService } from 'src/common/utils/helpers.service';
import {
  PaginationResponse,
  UserReponse,
  UserReponseString,
} from './user.response';
import { checkPolitics } from './decorator/premission.decorator';
import { Actions } from './user.enum';
import { isAdmin } from './guard/isAdmin.guard';
import { producerService } from './user.producer';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ImageUploader } from 'src/common/utils/utils';

@Resolver(User)
// @UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private helpService: HelperService,
    private producer: producerService,
  ) {}
  @Query(() => PaginationResponse)
  async getAllUser(@Args('page') page: number, @Args('limit') limit: number) {
    return await this.userService.getAllUser(page, limit);
  }

  @UseGuards(UserGuard)
  @Mutation(() => UserReponseString)
  async uploadImage(
    @Args('Image', { type: () => GraphQLUpload }) Image: FileUpload,
    @Context('req') req: Request,
  ) {
    //@ts-expect-error
    return await this.userService.addImage(Image, req.user?.id);
  }

  @checkPolitics(Actions.SEND_EMAIL)
  @UseGuards(UserGuard)
  @Mutation(() => UserReponseString)
  async sendMessageToAll(
    @Args('message', { type: () => String }) message: string,
  ) {
    return await this.producer.sendEmails(message);
  }

  @checkPolitics(Actions.GET_ME)
  @UseGuards(AuthGuards)
  @Query(() => UserReponse)
  async whoIAM(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => String)
  async removeUser(@Args('id') id: string) {
    return await this.userService.removeUser(id);
  }
  @Mutation(() => UserReponse)
  async signUp(@Args('input', { type: () => UserDto }) data: UserDto) {
    return await this.authService.signUp(data);
  }
  @checkPolitics(Actions.EDIT_SECURITYGROUP)
  @UseGuards(isAdmin)
  @Mutation(() => UserReponse)
  async giveUserScurityGroub(
    @Args('userId', { type: () => String }) userId: string,
    @Args('premissions', { type: () => Array(String) }) Permissions: string[],
  ) {
    return await this.userService.giveUserSecurityGroup(userId, Permissions);
  }

  @checkPolitics(Actions.UPDATE_USER)
  @UseGuards(UserGuard)
  @Mutation(() => UserReponse)
  async updateUser(
    @Args('userId', { type: () => String }) id: string,
    @Args({ name: 'input', type: () => UserDto }) data: UserDto,
  ) {
    return await this.userService.updateUser(id, data);
  }

  @Mutation(() => UserReponseString)
  async signIn(@Args('input', { type: () => AuthDto }) data: AuthDto) {
    console.log(data);
    const user = await this.authService.signIn(data);
    return user;
  }
  @Mutation(() => UserReponseString)
  async enterOTP(@Args('code', { type: () => Number }) code: number) {
    return await this.userService.validateOtp(code);
  }
  @Mutation(() => UserReponseString)
  async ForgetPassword(@Args('email', { type: () => String }) email: String) {
    return await this.userService.ForgetPassword(email);
  }
  @UseGuards(UserGuard)
  @Mutation(() => UserReponseString)
  async ResetPassword(
    @Args('password', { type: () => String }) password: string,
    @Args('confirmPassword', { type: () => String }) confirmPassword: string,
    @Context('req') request: Request,
    @CurrentUser() user: User,
  ) {
    return await this.userService.ResetPassword(
      password,
      confirmPassword,
      user,
    );
  }
  @UseGuards(UserGuard)
  @Mutation(() => UserReponse)
  async Follow(
    @CurrentUser('id') userId: string,
    @Args('targetUser', { type: () => String }) targetUserId: string,
  ) {
    return await this.userService.Follow(userId, targetUserId);
  }
  // @ResolveField()
  // hasPassword(@Parent() user: User) {
  //   return !!user.password;
  // }
}
