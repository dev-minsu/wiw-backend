import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User} from "./user.model";


export type GameDocument = Game & Document;

@ObjectType({ description: 'Game' })
@Schema({ timestamps: true })
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

  // @Prop({ type: [String], default: [] })
  // userIds: string[];
  //
  // @Prop()
  // ownerUserId: string

  @Prop()
  ownerAddress: string

  @Prop({ type: [String], default: [] })
  userAddresses: string[];

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

  @Field(() => Date)
  readonly createdAt?: Date;

  @Field(() => Date)
  readonly updatedAt?: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
