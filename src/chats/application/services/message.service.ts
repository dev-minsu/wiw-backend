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
    const message = new this.messageModel({ gameId, sender, content, messageType });
    const savedMessage = await message.save();

    this.logger.log(`게임 ${gameId}에서 새 메시지: ${content}`);

    // GraphQL Subscription을 통해 메시지를 브로드캐스트
    this.pubSub.publish(`GAME_CHAT_${gameId}`, { newMessage: savedMessage });

    return savedMessage;
  }

  async getMessagesByGame(gameId: string): Promise<Message[]> {
    return this.messageModel.find({ gameId }).sort({ createdAt: 1 }).exec();
  }

  // 🔹 GraphQL Subscription을 위한 PubSub 인스턴스 반환
  getPubSub() {
    return this.pubSub;
  }
}