import {Field, ID, Int, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";


export type MessageDocument = Message & Document;

@ObjectType({ description: 'Message' })
@Schema({ timestamps: true })
export class Message {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  @Prop({ type: { type: Types.ObjectId, ref: 'Game' }}) // Mongoose 관계 설정
  gameId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: { type: Types.ObjectId, ref: 'User' }}) // Mongoose 관계 설정
  sender: string

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
