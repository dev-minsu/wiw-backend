import {BadRequestException, HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message, MessageDocument} from "../../domain/models/message.model";
import {PubSub} from 'graphql-subscriptions';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  private pubSub = new PubSub();


  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async sendMessage(gameId: string, senderAddress: string, content: string, messageType: string): Promise<Message> {
    if (!gameId || !senderAddress || !content) {
      throw new BadRequestException('gameId, senderAddress, content is required!!!');
    }
    try {
      const message = new this.messageModel({ gameId, senderAddress, content, messageType });
      const savedMessage = await message.save();

      this.logger.log(savedMessage);
      await this.pubSub.publish(`${gameId}`, {newMessage: savedMessage});

      return savedMessage;
    } catch (error) {
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