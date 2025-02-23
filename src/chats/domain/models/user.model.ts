import {Field, ID, ObjectType} from '@nestjs/graphql';
import {IsOptional} from "class-validator";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


export type UserDocument = User & Document;

@ObjectType({ description: 'User' })
@Schema({ timestamps: true })      // Mongoose 스키마 데코레이터
export class User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @Prop()
  name?: string;

  @Field(() => String)
  @Prop()
  address: string

  @Field({ nullable: true })
  @Prop()
  @IsOptional()
  signature?: string

  @Field({ nullable: true })
  @Prop()
  @IsOptional()
  avatar?: string;

  @Field(() => Date)
  readonly createdAt?: Date;

  @Field(() => Date)
  readonly updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
