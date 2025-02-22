import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";


export type MessageDocument = Message & Document;

@ObjectType({ description: 'Message' })
@Schema({ timestamps: true })
export class Message {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Prop()
  gameId: string;

  @Field(() => String)
  @Prop()
  sender: string;

  @Field(() => String)
  @Prop()
  content: string

  @Field(() => String)
  @Prop()
  messageType: string

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
