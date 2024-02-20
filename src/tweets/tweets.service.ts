import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTweetInput } from './dto/create-tweet.input';
import { UpdateTweetInput } from './dto/update-tweet.input';
import { InjectModel } from '@nestjs/sequelize';
import { Tweets } from './entities/tweet.entity';
import { HelperService } from 'src/common/utils/helpers.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Files } from 'src/user/entity/files.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweets) private tweetRepo: typeof Tweets,
    @InjectQueue('tweet') private addQueue: Queue,
    private helpers: HelperService,
  ) {}
  async addTweet(createTweetInput: CreateTweetInput, userId: string) {
    const tweet = await this.tweetRepo.create({ createTweetInput, userId });
    return { data: tweet };
  }

  async findAll(page: number, limit: number) {
    const count = (await this.tweetRepo.findAll()).length;
    return {
      data: await this.helpers.paginate(this.tweetRepo, {
        page,
        limit,
        hasNext: count > page * limit,
        hasPrevious: page > 1,
        totalCount: count,
      }),
    };
  }

  async findOne(id: string) {
    try {
      const tweet = await this.tweetRepo.findByPk(id);
      return tweet;
    } catch (err) {
      throw err;
    }
  }

  async update(updateTweetInput: UpdateTweetInput) {
    const tweet = await this.findOne(updateTweetInput.id);
    return {
      data: await tweet.update({
        tweet: updateTweetInput.tweet,
      }),
    };
  }
  async updateMyTweet(userId: string, updateTweetInput: UpdateTweetInput) {
    const tweet = await this.tweetRepo.findOne({
      where: {
        id: updateTweetInput.id,
        userId,
      },
    });
    return {
      data: await tweet.update({
        tweet: updateTweetInput.tweet,
      }),
    };
  }
  async remove(id: string) {
    try {
      await this.tweetRepo.destroy({ where: { id } });
    } catch (err) {
      throw err;
    }
    return { data: 'tweet deleted successfull' };
  }
  async removeMyTweet(userId: string) {
    const tweet = await this.tweetRepo.findOne({
      where: {
        userId,
      },
    });
    await tweet.destroy();
    return { data: 'tweet deleted successfull' };
  }
  async addReply(createTweetInput: CreateTweetInput, userId: string) {
    const tweet = await this.tweetRepo.create({
      createTweetInput,
      userId,
      isReply: true,
    });
    const tweetOrgin = await this.findOne(createTweetInput.tweetId);
    if (tweetOrgin) {
      const allReplies = tweetOrgin.replies.concat([tweet.id]);
      return {
        data: await tweetOrgin.update({
          replies: allReplies,
        }),
      };
    }
  }

  async Retweet(createTweetInput: CreateTweetInput, userId: string) {
    const tweetOrgin = await this.findOne(createTweetInput.tweetId);
    const tweet = await this.tweetRepo.create({
      createTweetInput,
      userId,
      isRetweet: true,
      retweets: tweetOrgin.id,
    });
    return { data: tweet };
  }
  async addImgTweet(
    createTweetInput: CreateTweetInput,
    Image: FileUpload[],
    userId: string,
  ) {
    let files = [];
    Image.map(async (l) => {
      const { filename, createReadStream } = l;
      const newFileName = filename.replace(
        filename.split('.')[0],
        `${filename.split('.')[0]}${Date.now()}`,
      );
      this.addQueue.add('uploadImages', {
        filename: newFileName,
        createReadStream,
        userId,
        files,
      });
    });
    console.log(files);
    return await this.tweetRepo.create({
      createTweetInput,
      Tweet_Images: files,
    });
  }
}
