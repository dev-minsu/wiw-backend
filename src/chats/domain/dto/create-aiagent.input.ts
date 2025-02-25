import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class CreateAiAgentInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  context: string;

  @Field(() => String)
  address: string;
}
