import {Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription} from '@nestjs/graphql';
import {Game} from "../../domain/models/game.model";
import {GameService} from "../../application/services/game.service";
import {User} from "../../domain/models/user.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";
import {Message} from "../../domain/models/message.model";
import {MessageService} from "../../application/services/message.service";
import {UserService} from "../../application/services/user.service";
import {NotFoundException} from "@nestjs/common";
import {AiAgentService} from "../../application/services/aiagent.service";
import {AiAgent} from "../../domain/models/aiagent.model";
import {PubSub} from "graphql-subscriptions";
import {BettingService} from "../../application/services/betting.service";
import {Betting} from "../../domain/models/betting.model";
import {CreateBettingInput} from "../../domain/dto/create-betting.input";
import {GameEvent} from "../../domain/models/game.event.model";

@Resolver(() => Game)
export class GameResolver {
  private pubSub: PubSub;

  constructor(private readonly gameService: GameService, private readonly messageService: MessageService, private readonly userService: UserService, private readonly aiAgentService: AiAgentService, private readonly bettingService: BettingService) {
    this.pubSub = this.gameService.getPubSub();
  }

  @Mutation(() => Game)
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
  ): Promise<Game> {
    return this.gameService.create(createGameInput);
  }

  @Mutation(() => Game)
  async joinGame(@Args('userAddress') address: string, @Args('gameId') gameId: string): Promise<Game> {
    return this.gameService.joinGame(address, gameId);
  }

  @Mutation(() => Betting)
  async createBetting(@Args('gameId') gameId: string, @Args('createBettingInput') createBettingInput: CreateBettingInput): Promise<Betting> {
    return this.gameService.createBetting(gameId, createBettingInput);
  }

  @Mutation(() => Boolean)
  async deleteAllBettingsInGame(@Args('gameId') gameId: string): Promise<boolean> {
    this.gameService.deleteAllBettings(gameId);
    return true;
  }

  @Mutation(() => Boolean)
  async broadcastEvent(@Args('gameId') gameId: string, @Args('event') event: string): Promise<boolean> {
    await this.gameService.broadcastEvent(gameId, event);
    return true
  }

  @Mutation(() => Boolean)
  async updateWinnerAiAgent(@Args('gameId') gameId: string, @Args('aiAgentId') aiAgentId: string): Promise<boolean> {
    await this.gameService.updateWinnerAiAgent(gameId, aiAgentId);
    return true;
  }

  @Query(() => Game)
  async getGameById(@Args('id') id: string): Promise<Game> {
    return this.gameService.findGameById(id);
  }

  @Query(() => [Game])
  async getJoinedGames(@Args('userAddress') address: string): Promise<Game[]> {
    return this.gameService.getJoinedGames(address);
  }

  @Query(() => Boolean)
  async isJoinedGame(@Args('userAddress') address: string, @Args('gameId') gameId: string): Promise<boolean> {
    const game = await this.gameService.findGameById(gameId);
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }
    return game.userAddresses.includes(address);
  }

  @Query(() => [Game])
  async getGamesByOwnerAddress(@Args('ownerAddress') ownerAddress: string): Promise<Game[]> {
    return this.gameService.getGamesByOwnerAddress(ownerAddress);
  }

  @ResolveField('messages', () => [Message])
  async getMessages(@Parent() game: Game) {
    return this.messageService.getMessagesByGame(game.id);
  }

  @ResolveField('owner', () => User, { nullable: true })
  async getOwner(@Parent() game: Game): Promise<User | null> {
    return this.userService.findUserByAddress(game.ownerAddress);
  }

  @ResolveField('users', () => [User], { nullable: true })
  async getUsers(@Parent() game: Game): Promise<User[]> {
    return this.userService.findUsersByAddresses(game.userAddresses);
  }

  @ResolveField('aiAgents', () => [AiAgent], { nullable: true })
  async getAiAgents(@Parent() game: Game): Promise<AiAgent[]> {
    return this.aiAgentService.findByIds(game.aiAgentIds);
  }

  @ResolveField('bettings', () => [Betting], { nullable: true })
  async getBettings(@Parent() game: Game): Promise<Betting[]> {
    return this.bettingService.findByIds(game.bettingIds);
  }

  @Subscription(() => GameEvent, {
    filter: (payload, variables) => payload.newStatus.game.id === variables.gameId,
  })
  newStatus(@Args('gameId') gameId: string) {
    return this.pubSub.asyncIterator(`${gameId}`);
  }
}
