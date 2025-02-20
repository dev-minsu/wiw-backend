import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export type GameDocument = Game & Document;

@ObjectType({ description: 'Game' })
@Schema({ timestamps: true })      // Mongoose 스키마 데코레이터
export class Game {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  @Prop()
  limit: number

  @Field(() => Number)
  @Prop()
  defaultBettingAmount: number

  @Field(() => String)
  @Prop()
  bettingTokenDenom: string

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  userAddresses: string[];

  @Field(() => String)
  @Prop()
  ownerUserAddress: string

  @Field(() => String)
  @Prop()
  name: string

  @Field(() => String)
  @Prop()
  topic: string

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
