import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {MessageService} from "../application/services/message.service";
import {Message, MessageSchema} from "../domain/models/message.model";
import {MessageResolver} from "../adapter/primary/message.resolver";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageResolver, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
