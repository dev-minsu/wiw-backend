import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message, MessageDocument} from "../../domain/models/message.model";
import {CreateMessageInput} from "../../domain/dto/create-message.input";
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  private pubSub = new PubSub(); // 실시간 메시지 전송을 위한 PubSub


  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async sendMessage(gameId: string, sender: string, content: string, messageType: string): Promise<Message> {
    try {
      if (!gameId || !sender || !content) {
        throw new Error('gameId, sender, content is required!!!');
      }

      const message = new this.messageModel({ gameId, sender, content, messageType });
      const savedMessage = await message.save();

      this.logger.log(savedMessage);
      await this.pubSub.publish(`${gameId}`, {newMessage: savedMessage});

      return savedMessage;
    } catch (error) {
      console.error(`sendMessage error: ${error.message}`);
      throw new Error('sendMessage failed');
    }
  }

  async getMessagesByGame(gameId: string): Promise<Message[]> {
    return this.messageModel.find({ gameId }).sort({ createdAt: 1 }).exec();
  }

  getPubSub() {
    return this.pubSub;
  }
}