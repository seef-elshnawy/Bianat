import { InjectModel } from '@nestjs/sequelize';
import DataLoader from 'dataloader';
import { Op } from 'sequelize';
import { Tweets } from 'src/tweets/entities/tweet.entity';
import { DataLoaderProvider } from './decorator/dataloader-provide.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@DataLoaderProvider()
export class TweetDataLoaderService {
  constructor(@InjectModel(Tweets) private tweetRepo: typeof Tweets) {}

  createDataloader() {
    return new DataLoader<string, Tweets>(
      //@ts-expect-error
      async (keys: string[]) => await this.batchUsersAndGetTweets(keys),
    );
  }
  async batchUsersAndGetTweets(ids: string[]) {
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

    const getTweetFromOneWeekToNow = (date: Date) => {
      const daysOfWeek = [];
      const startOfWeek = new Date(date);
      const millisecondsInDay = 24 * 60 * 60 * 1000;
      const dayOfWeek = startOfWeek.getDay();
      const daysToSubtract = 7 - dayOfWeek;
      startOfWeek.setTime(
        startOfWeek.getTime() - daysToSubtract * millisecondsInDay,
      );
      startOfWeek.setHours(0, 0, 0, 0);
      for (let i = 0; i < 7; i++) {
        const currentDayTimestamp =
          startOfWeek.getTime() + i * millisecondsInDay;
        daysOfWeek.push(currentDayTimestamp);
      }
      return daysOfWeek;
    };

    const mapOnTweet = (id: string) => {
      const tweet = getTweetFromOneWeekToNow(new Date()).map((date) => ({
        [date]: {
          tweets: tweets.filter(
            (l) =>
              l.createdAt.getDay() === new Date(date).getDay() &&
              l.userId === id,
          ).length,
          score: parseFloat(
            (
              (tweets.filter(
                (l) =>
                  l.createdAt.getDay() === new Date(date).getDay() &&
                  l.userId === id,
              ).length /
                7) *
              100
            ).toFixed(2),
          ),
        },
      }));
      return tweet;
    };
    return ids.map((id) => mapOnTweet(id));
  }
}
