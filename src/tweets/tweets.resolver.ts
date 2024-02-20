import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TweetsService } from './tweets.service';
import { Tweets } from './entities/tweet.entity';
import { CreateTweetInput } from './dto/create-tweet.input';
import { UpdateTweetInput } from './dto/update-tweet.input';
import {
  TweetResponse,
  TweetStringResponse,
  TweetsResponse,
} from './tweet.response';
import { UseGuards } from '@nestjs/common';
import { UserGuard } from 'src/user/guard';
import { checkPolitics } from 'src/user/decorator/premission.decorator';
import { Actions } from 'src/user/user.enum';
import { CurrentUser } from 'src/auth/decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(() => Tweets)
export class TweetsResolver {
  constructor(private readonly tweetsService: TweetsService) {}

  @UseGuards(UserGuard)
  @Mutation(() => Tweets)
  async createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @CurrentUser('id') userId: string,
  ) {
    return await this.tweetsService.addTweet(createTweetInput, userId);
  }

  @UseGuards(UserGuard)
  @Query(() => TweetsResponse, { name: 'tweets' })
  async findAll(
    @Args('page', { type: () => String }) page: number,
    @Args('limit', { type: () => String }) limit: number,
  ) {
    return await this.tweetsService.findAll(page, limit);
  }

  @UseGuards(UserGuard)
  @Query(() => TweetResponse, { name: 'tweet' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.tweetsService.findOne(id);
  }

  @checkPolitics(Actions.UPDATE_TWEETS)
  @UseGuards(UserGuard)
  @Mutation(() => TweetResponse)
  async updateTweet(
    @Args('updateTweetInput') updateTweetInput: UpdateTweetInput,
  ) {
    return await this.tweetsService.update(updateTweetInput);
  }

  @UseGuards(UserGuard)
  @Mutation(() => TweetResponse)
  async updateMyTweet(
    @CurrentUser('id') userId: string,
    @Args('updateTweetInput') updateTweetInput: UpdateTweetInput,
  ) {
    return await this.tweetsService.updateMyTweet(userId, updateTweetInput);
  }
  @checkPolitics(Actions.DELETE_TWEETS)
  @UseGuards(UserGuard)
  @Mutation(() => TweetStringResponse)
  async removeTweet(@Args('id', { type: () => String }) id: string) {
    return await this.tweetsService.remove(id);
  }
  @UseGuards(UserGuard)
  @Mutation(() => TweetStringResponse)
  async removeMyTweet(@CurrentUser('id') userId: string) {
    return await this.tweetsService.removeMyTweet(userId);
  }
  @UseGuards(UserGuard)
  @Mutation(() => TweetResponse)
  async addReply(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @CurrentUser('id') userId: string,
  ) {
    return await this.tweetsService.addReply(createTweetInput, userId);
  }
  @UseGuards(UserGuard)
  @Mutation(() => TweetResponse)
  async Retweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @CurrentUser('id') userId: string,
  ) {
    return await this.tweetsService.Retweet(createTweetInput, userId);
  }
  @Mutation(() => TweetResponse)
  async addImageTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @Args('Images', { type: () => GraphQLUpload }) Images: FileUpload[],
    @CurrentUser('id') userId: string,
  ) {
    return this.tweetsService.addImgTweet(createTweetInput, Images, userId);
  }
}