import {Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription} from '@nestjs/graphql';
import {Message} from "../../domain/models/message.model";
import {CreateMessageInput} from "../../domain/dto/create-message.input";
import {MessageService} from "../../application/services/message.service";
import {PubSub} from "graphql-subscriptions";
import {Game} from "../../domain/models/game.model";

@Resolver(() => Message)
export class MessageResolver {
  private pubSub: PubSub;

  constructor(private readonly messageService: MessageService) {
    this.pubSub = this.messageService.getPubSub(); // PubSub 인스턴스를 가져옴
  }

  @Query(() => [Message])
  async getMessagesByGame(@Args('gameId') gameId: string): Promise<Message[]> {
    return this.messageService.getMessagesByGame(gameId);
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args('gameId') gameId: string,
    @Args('sender') sender: string,
    @Args('content') content: string,
    @Args('messageType') messageType: string,
  ): Promise<Message> {
    return this.messageService.sendMessage(gameId, sender, content, messageType);
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => payload.newMessage.gameId === variables.gameId,
  })
  newMessage(@Args('gameId') gameId: string) {
    return this.pubSub.asyncIterator(`GAME_CHAT_${gameId}`);
  }
}
