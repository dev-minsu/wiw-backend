import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User} from "./user.model";
import {AiAgent} from "./aiagent.model";
import {Betting} from "./betting.model";


export type GameDocument = Game & Document;

@ObjectType({ description: 'Game' })
@Schema({ timestamps: true })
export class Game {
  @Field(() => ID)
  id: string;

  @Prop()
  ownerAddress: string

  @Prop({ type: [String], default: [] })
  userAddresses: string[];

  @Prop({ type: [String], default: [] })
  aiAgentIds?: string[]

  @Prop({ type: [String], default: [] })
  bettingIds?: string[]

  @Field(() => Int)
  @Prop()
  limit: number

  @Field(() => Number)
  @Prop()
  defaultBettingAmount: number

  @Field(() => String)
  @Prop()
  bettingTokenDenom: string

  @Field(() => User, { nullable: true })
  owner?: User;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => String)
  @Prop()
  name: string

  @Field(() => String)
  @Prop()
  topic: string

  @Field(() => [AiAgent], { nullable: true })
  aiAgents?: AiAgent[]

  @Field(() => [Betting], { nullable: true })
  bettings?: Betting[]

  @Field(() => String, { nullable: true })
  @Prop()
  winnerAiAgentId?: string

  @Field(() => Date)
  readonly createdAt?: Date;

  @Field(() => Date)
  readonly updatedAt?: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
