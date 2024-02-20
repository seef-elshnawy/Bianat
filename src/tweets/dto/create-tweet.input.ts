import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTweetInput {
  @Field(() => String)
  tweetId: string;

  @Field(() => String)
  tweet: string;
}
