import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {MessageService} from "../application/services/message.service";
import {Message, MessageSchema} from "../domain/models/message.model";
import {MessageResolver} from "../adapter/primary/message.resolver";
import {User, UserSchema} from "../domain/models/user.model";
import {UserService} from "../application/services/user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }, { name: User.name, schema: UserSchema }]),
  ],
  providers: [MessageResolver, MessageService, UserService],
  exports: [MessageService],
})
export class MessageModule {}
