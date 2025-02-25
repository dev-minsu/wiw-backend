import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class CreateBettingInput {
  @Field(() => String)
  ownerAddress: string;

  @Field(() => String)
  predictionWinnerAiAgentId: string;

  @Field(() => Number)
  bettingAmount: number;
}
