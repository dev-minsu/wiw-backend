import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IsOptional} from "class-validator";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export type UserDocument = User & Document;

@ObjectType({ description: 'User' })
@Schema()      // Mongoose 스키마 데코레이터
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field({ nullable: true })
  @Prop()
  @IsOptional()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
