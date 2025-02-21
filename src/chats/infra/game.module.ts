import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {GameService} from "../application/services/game.service";
import {GameResolver} from "../adapter/primary/game.resolver";
import {Game, GameSchema} from "../domain/models/game.model";
import {MessageService} from "../application/services/message.service";
import {Message, MessageSchema} from "../domain/models/message.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }, { name: Message.name, schema: MessageSchema }]),
  ],
  providers: [GameResolver, GameService, MessageService],
  exports: [GameService],
})
export class GameModule {}
