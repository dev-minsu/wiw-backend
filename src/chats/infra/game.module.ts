import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {GameService} from "../application/services/game.service";
import {GameResolver} from "../adapter/primary/game.resolver";
import {Game, GameSchema} from "../domain/models/game.model";
import {MessageService} from "../application/services/message.service";
import {Message, MessageSchema} from "../domain/models/message.model";
import {User, UserSchema} from "../domain/models/user.model";
import {UserService} from "../application/services/user.service";
import {AiAgent, AiAgentSchema} from "../domain/models/aiagent.model";
import {AiAgentService} from "../application/services/aiagent.service";
import {BettingService} from "../application/services/betting.service";
import {Betting, BettingSchema} from "../domain/models/betting.model";
import {BettingModule} from "./betting.module";
import {MessageModule} from "./message.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }, { name: Message.name, schema: MessageSchema }, { name: User.name, schema: UserSchema }, { name: AiAgent.name, schema: AiAgentSchema }, { name: Betting.name, schema: BettingSchema }]),
    // MessageModule,
    // BettingModule,
  ],
  providers: [GameResolver, GameService, MessageService, UserService, AiAgentService, BettingService],
  exports: [GameService],
})
export class GameModule {}
