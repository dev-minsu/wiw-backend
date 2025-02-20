import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {GameService} from "../application/services/game.service";
import {GameResolver} from "../adapter/primary/game.resolver";
import {Game, GameSchema} from "../domain/models/game.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [GameResolver, GameService],
  exports: [GameService],
})
export class GameModule {}
