import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {User} from "./user.model";


export type MessageDocument = Message & Document;

@ObjectType({ description: 'Message' })
@Schema({ timestamps: true })
export class Message {
  @Field(() => ID)
  id: string;

  @Prop()
  gameId: string;

  @Prop()
  senderAddress: string;

  @Field(() => User, { nullable: true })
  sender?: User;

  @Field(() => String)
  @Prop()
  content: string

  @Field(() => String)
  @Prop()
  messageType: string

  @Field(() => Date)
  readonly createdAt?: Date;

  @Field(() => Date)
  readonly updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
