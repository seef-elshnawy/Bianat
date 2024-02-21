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
import { Op } from 'sequelize';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweets) private tweetRepo: typeof Tweets,
    @InjectQueue('tweet') private addQueue: Queue,
    @InjectModel(Files) private fileRepo: typeof Files,
    private helpers: HelperService,
  ) {}
  async addTweet(createTweetInput: CreateTweetInput, userId: string) {
    const tweet = await this.tweetRepo.create({
      tweet: createTweetInput.tweet,
      userId,
    });
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
  async addReply(
    createTweetInput: CreateTweetInput,
    userId: string,
    tweetId: string,
  ) {
    const tweetOrgin = await this.findOne(tweetId);

    const tweet = await this.tweetRepo.create({
      tweet: createTweetInput.tweet,
      userId,
      parentReply: tweetOrgin.id,
    });
    if (tweetOrgin) {
      const allReplies = tweetOrgin.replies.concat([tweet.id]);
      await tweetOrgin.update({
        replies: allReplies,
      });
      return {
        data: tweet,
      };
    }
  }

  async Retweet(
    createTweetInput: CreateTweetInput,
    userId: string,
    tweetId: string,
  ) {
    const tweetOrgin = await this.findOne(tweetId);
    const tweet = await this.tweetRepo.create({
      tweet: createTweetInput.tweet,
      userId,
      retweet: tweetOrgin.id,
    });
    await tweetOrgin.increment('retweet_counter', { by: 1 });
    return { data: tweet };
  }
  async addImgTweet(
    createTweetInput: CreateTweetInput,
    Image: FileUpload,
    userId: string,
  ) {
    console.log(Image);
    // console.log(l[3]);
    const { filename, createReadStream } = Image;
    console.log(filename.split('.')[0].split('-')[0]);
    const newFileName = filename.replace(
      filename.split('.')[0],
      `${filename.split('.')[0].split('-')[0]}-${Date.now()}`,
    );
    return await new Promise(async (res, rej) => {
      createReadStream().pipe(
        createWriteStream(join(process.cwd(), `src/uploads/${newFileName}`))
          .on('finish', async () => {
            await this.fileRepo.create({
              userId: userId,
              fileLink: newFileName,
            });
            const tweet = await this.tweetRepo.create({
              tweet: createTweetInput.tweet,
              Tweet_Images: [newFileName],
            });
            res({
              data: tweet,
            });
          })
          .on('error', (err) => {
            rej(
              new ForbiddenException(`couldn't save img ${newFileName} ${err}`),
            );
          }),
      );
    });
  }
}
