import {HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Game, GameDocument} from "../../domain/models/game.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const { ownerAddress } = createGameInput;
    const userAddresses = [ownerAddress];
    const bettingTokenDenom = "MOVE"
    const createdUser = new this.gameModel({ ...createGameInput, userAddresses, bettingTokenDenom});
    return createdUser.save();
  }

  async joinGame(address: string, gameId: string): Promise<Game> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) {
      throw new HttpException('Game not found.', HttpStatus.NOT_FOUND);
    }

    if (game.userAddresses.length >= game.limit) {
      throw new HttpException('Game limit reached, cannot join.', HttpStatus.BAD_REQUEST);
    }

    if (game.userAddresses.includes(address)) {
      throw new HttpException('User is already in the game.', HttpStatus.BAD_REQUEST);
    }

    game.userAddresses.push(address);

    await game.save();

    return game;
  }

  async getJoinedGames(address: string): Promise<Game[]> {
    return this.gameModel.find({ userAddresses: address }).exec();
  }

  async getGamesByOwner(userId: string): Promise<Game[]> {
    const games = await this.gameModel.find({ ownerUserId: userId }).exec();
    this.logger.log(`Found ${games.length} games for userId: ${userId}`);
    return games;
  }

  async getGamesByOwnerAddress(address: string): Promise<Game[]> {
    const games = await this.gameModel.find({ ownerAddress: address }).exec();
    this.logger.log(`Found ${games.length} games for user address: ${address}`);
    return games;
  }
}