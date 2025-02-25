import {Field, ObjectType} from "@nestjs/graphql";
import {Game} from "./game.model";

@ObjectType({ description: 'GameEvent' })
export class GameEvent {
  @Field(() => String, { nullable: true })
  event?: string

  @Field(() => Game, { nullable: true })
  game?: Game
}