import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Game, GameDocument} from "../../domain/models/game.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";

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

  async findAll(): Promise<Game[]> {
    try {
      const games = await this.gameModel.find().exec();
      this.logger.log(`게임 목록 조회 성공 (총 ${games.length}개)`);
      return games;
    } catch (error) {
      this.logger.error(`게임 목록 조회 실패: ${error.message}`);
      throw new Error("게임 목록을 불러오는 중 오류가 발생했습니다.");
    }
  }
}