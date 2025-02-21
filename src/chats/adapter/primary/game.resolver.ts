import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {Game} from "../../domain/models/game.model";
import {GameService} from "../../application/services/game.service";
import {User} from "../../domain/models/user.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";
import {Message} from "../../domain/models/message.model";
import {MessageService} from "../../application/services/message.service";

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService, private readonly messageService: MessageService) {}

  @Mutation(() => Game)
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
  ): Promise<Game> {
    return this.gameService.create(createGameInput);
  }

  @Query(() => [Game])
  async getGamesByOwnerAddress(@Args('userAddress') address: string): Promise<Game[]> {
    return this.gameService.getGamesByOwnerAddress(address);
  }

  @ResolveField('messages', () => [Message])
  async getMessages(@Parent() game: Game) {
    return this.messageService.getMessagesByGame(game.id);
  }
}
