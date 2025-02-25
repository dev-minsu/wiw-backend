import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {MessageService} from "../application/services/message.service";
import {Message, MessageSchema} from "../domain/models/message.model";
import {MessageResolver} from "../adapter/primary/message.resolver";
import {User, UserSchema} from "../domain/models/user.model";
import {UserService} from "../application/services/user.service";
import {Game, GameSchema} from "../domain/models/game.model";
import {GameService} from "../application/services/game.service";
import {BettingModule} from "./betting.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }, { name: Message.name, schema: MessageSchema }, { name: User.name, schema: UserSchema }]),
    BettingModule
  ],
  providers: [MessageResolver, GameService, MessageService, UserService],
  exports: [MessageService],
})
export class MessageModule {}
