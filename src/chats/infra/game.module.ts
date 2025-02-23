import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {GameService} from "../application/services/game.service";
import {GameResolver} from "../adapter/primary/game.resolver";
import {Game, GameSchema} from "../domain/models/game.model";
import {MessageService} from "../application/services/message.service";
import {Message, MessageSchema} from "../domain/models/message.model";
import {User, UserSchema} from "../domain/models/user.model";
import {UserService} from "../application/services/user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }, { name: Message.name, schema: MessageSchema }, { name: User.name, schema: UserSchema }]),
  ],
  providers: [GameResolver, GameService, MessageService, UserService],
  exports: [GameService],
})
export class GameModule {}
