import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Game} from "../../domain/models/game.model";
import {GameService} from "../../application/services/game.service";
import {User} from "../../domain/models/user.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Mutation(() => Game)
  async createGame(
    @Args('createGameInput') createGameInput: CreateGameInput,
  ): Promise<Game> {
    return this.gameService.create(createGameInput);
  }

  @Query(() => [Game])
  async getGames(): Promise<Game[]> {
    return this.gameService.findAll();
  }
}
