import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {Game} from "../../domain/models/game.model";
import {GameService} from "../../application/services/game.service";
import {User} from "../../domain/models/user.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";
import {Message} from "../../domain/models/message.model";
import {MessageService} from "../../application/services/message.service";
import {UserService} from "../../application/services/user.service";
import {NotFoundException} from "@nestjs/common";

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService, private readonly messageService: MessageService, private readonly userService: UserService) {}

  @Mutation(() => Game)
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
  ): Promise<Game> {
    return this.gameService.create(createGameInput);
  }

  @Mutation(() => Game)
  async joinGame(@Args('userAddress') address: string, @Args('gameId') gameId: string): Promise<Game> {
    return this.gameService.joinGame(address, gameId)
  }

  @Query(() => [Game])
  async getJoinedGames(@Args('userAddress') address: string): Promise<Game[]> {
    return this.gameService.getJoinedGames(address);
  }

  @Query(() => Boolean)
  async isJoinedGame(@Args('userAddress') address: string, @Args('gameId') gameId: string): Promise<boolean> {
    // 해당 게임을 가져옴
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
}
