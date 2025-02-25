import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export type AiAgentDocument = AiAgent & Document;

@ObjectType({ description: 'Betting' })
@Schema({ timestamps: true })
export class AiAgent {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Prop()
  name: string

  @Field(() => String)
  @Prop()
  context: string

  @Field(() => String)
  @Prop()
  address: string

  @Field(() => Date)
  readonly createdAt?: Date;

  @Field(() => Date)
  readonly updatedAt?: Date;
}

export const AiAgentSchema = SchemaFactory.createForClass(AiAgent);
