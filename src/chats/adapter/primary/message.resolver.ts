import {Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription} from '@nestjs/graphql';
import {Message} from "../../domain/models/message.model";
import {MessageService} from "../../application/services/message.service";
import {PubSub} from "graphql-subscriptions";
import {UserService} from "../../application/services/user.service";
import {User} from "../../domain/models/user.model";
import {GameService} from "../../application/services/game.service";
import {NotFoundException} from "@nestjs/common";

@Resolver(() => Message)
export class MessageResolver {
  private pubSub: PubSub;

  constructor(private readonly messageService: MessageService, private readonly userService: UserService, private readonly gameService: GameService) {
    this.pubSub = this.messageService.getPubSub(); // PubSub 인스턴스를 가져옴
  }

  @Query(() => [Message])
  async getMessagesByGame(@Args('gameId') gameId: string, @Args('userAddress') userAddress: string): Promise<Message[]> {
    const game = await this.gameService.findGameById(gameId);
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    if (!game.userAddresses.includes(userAddress)) {
      throw new NotFoundException(`User with address ${userAddress} is not part of this game`);
    }

    return this.messageService.getMessagesByGame(gameId);
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args('gameId') gameId: string,
    @Args('senderAddress') senderAddress: string,
    @Args('content') content: string,
    @Args('messageType') messageType: string,
  ): Promise<Message> {
    return this.gameService.sendMessage(gameId, senderAddress, content, messageType);
  }

  @Subscription(() => Message, {
    filter: (payload, variables) => payload.newMessage.gameId === variables.gameId,
  })
  newMessage(@Args('gameId') gameId: string) {
    return this.pubSub.asyncIterator(`${gameId}`);
  }

  @ResolveField('sender', () => User, { nullable: true })
  async getSender(@Parent() message: Message): Promise<User | null> {
    return this.userService.findUserByAddress(message.senderAddress);
  }
}
