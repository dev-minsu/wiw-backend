import {Field, InputType, Int} from '@nestjs/graphql';

@InputType()
export class CreateGameInput {
  @Field(() => Int)
  limit: number;

  @Field(() => String)
  name: string;

  @Field(() => Number)
  defaultBettingAmount: number;

  @Field(() => String)
  topic: string;

  @Field(() => String)
  ownerAddress: string;
}
