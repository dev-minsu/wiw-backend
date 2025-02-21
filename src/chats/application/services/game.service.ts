import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Game, GameDocument} from "../../domain/models/game.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";
import {Parent, ResolveField} from "@nestjs/graphql";
import {Message} from "../../domain/models/message.model";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const { ownerUserAddress} = createGameInput;
    const userAddresses = [ownerUserAddress];
    const bettingTokenDenom = "MOVE"
    const createdUser = new this.gameModel({ ...createGameInput, userAddresses, bettingTokenDenom});
    return createdUser.save();
  }

  async getGamesByOwnerAddress(address: string): Promise<Game[]> {
    const games = await this.gameModel.find({ ownerUserAddress: address }).exec();
    this.logger.log(`Found ${games.length} games for user address: ${address}`);
    return games;
  }
}