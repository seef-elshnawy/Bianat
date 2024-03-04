import {
  Args,
  Context,
  GqlExecutionContext,
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
import { GraphQLJSON } from 'graphql-scalars';
import { TweetDataLoaderService } from 'src/dataloader/tweets-dataloader.service';
import { Loader } from 'src/dataloader/decorator/dataloader.decorator';

@Resolver(User)
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
    @CurrentUser('id') userId: string,
  ) {
    return await this.userService.addImage(Image, userId);
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
  @UseGuards(UserGuard)
  @Mutation(() => UserReponse)
  async addHobbies(
    @CurrentUser('id') userId: string,
    @Args('hobbie', { type: () => String }) hobbie: string,
  ) {
    return await this.userService.addHobbies(hobbie, userId);
  }
  @Query(() => [User])
  async Users() {
    return await this.userService.getAllUser(1, 10000);
  }

  @ResolveField(() => GraphQLJSON)
  async getTweets(
    @Parent() user: User,
    @Context() ctx,
    @Loader(TweetDataLoaderService) tweetLoader,
  ) {
    const { id: userId } = user;
    const { dataloader } = ctx.req;
    console.log(tweetLoader, 'tweetLoader');
    return await this.userService.getTweetsByUser(userId, tweetLoader);
  }
}
