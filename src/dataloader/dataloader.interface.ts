import DataLoader from 'dataloader';
import { Tweets } from 'src/tweets/entities/tweet.entity';

export interface IDataLoader {
  tweets: DataLoader<string, Tweets>;
}
