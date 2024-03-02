import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Tweets } from 'src/tweets/entities/tweet.entity';
import { IDataLoader } from './dataloader.interface';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class DataloaderService {
  constructor(@InjectModel(Tweets) private tweetRepo: typeof Tweets) {}
  async getTweetsUsersByBatch(ids: string[]) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const tweets = await this.tweetRepo.findAll({
      where: {
        userId: ids,
        createdAt: {
          [Op.gte]: oneWeekAgo,
          [Op.lte]: Date.now(),
        },
      },
    });
    const getDaysOfWeek = (date: Date) => {
      const startOfWeek = new Date(date);
      const daysOfWeekTimeStamp = [];
      const dayOfWeek = startOfWeek.getDay();
      const milliSecondOfDay = 24 * 60 * 60 * 1000;
      const dayToSubStract = dayOfWeek % 7;
      startOfWeek.setTime(
        startOfWeek.getTime() - dayToSubStract * milliSecondOfDay,
      );
      startOfWeek.setHours(0, 0, 0, 0);
      for (let i = 0; i < 7; i++) {
        const currentDayStamp = startOfWeek.getTime() + i * milliSecondOfDay;
        daysOfWeekTimeStamp.push(currentDayStamp);
      }
      return daysOfWeekTimeStamp;
    };

    const mapOnDate = (id: string) => {
      return getDaysOfWeek(new Date()).map((date) => ({
        [date]: {
          tweets: tweets.filter(
            (tweet) =>
              tweet.createdAt.getDay() === new Date(date).getDay() &&
              tweet.userId === id,
          ).length,
        },
      }));
    };
    return ids.map((id) => mapOnDate(id));
  }

  getTweetLoader(): IDataLoader {
    const tweetLoader = this.addTweetloader();
    return {
      tweets: tweetLoader,
    };
  }
  private addTweetloader() {
    return new DataLoader<string, Tweets>(
      //@ts-expect-error
      async (key: readonly string[]) => await this.getTweetsUsersByBatch(key),
    );
  }
}
