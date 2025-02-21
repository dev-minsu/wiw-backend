import {Field, InputType, Int} from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field(() => Int)
  limit: number;

  // @Field(() => String)
  // name: string;
  //
  // @Field(() => Number)
  // defaultBettingAmount: number;
  //
  // @Field(() => String)
  // topic: string;
  //
  // @Field(() => String)
  // ownerUserAddress: string;
}
