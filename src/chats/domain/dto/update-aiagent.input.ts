import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class UpdateAiAgentInput {
  @Field(() => String)
  name?: string;

  @Field(() => String)
  context?: string;

  @Field(() => String)
  address?: string;
}
