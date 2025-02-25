import {Field, Float, ID, Int, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {AiAgent} from "./aiagent.model";


export type BettingDocument = Betting & Document;

@ObjectType({ description: 'Betting' })
@Schema({ timestamps: true })
export class Betting {
  @Field(() => ID)
  id: string;

  @Prop()
  ownerAddress: string;

  @Prop()
  predictionWinnerAiAgentId: string

  @Field(() => Float)
  @Prop()
  bettingAmount: number;

  @Field(() => String)
  @Prop()
  bettingTokenDenom: string

  @Field(() => String)
  @Prop()
  result: string

  @Field(() => AiAgent)
  predictionWinnerAiAgent: AiAgent

  @Field(() => Date)
  readonly createdAt?: Date;

  @Field(() => Date)
  readonly updatedAt?: Date;
}

export const BettingSchema = SchemaFactory.createForClass(Betting);
