import {BadRequestException, Injectable, Logger, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Game, GameDocument} from "../../domain/models/game.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";
import {MessageService} from "./message.service";
import {Message} from "../../domain/models/message.model";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>,
              private readonly messageService: MessageService,) {}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const { ownerAddress } = createGameInput;
    const userAddresses = [ownerAddress];
    const bettingTokenDenom = "MOVE"
    const createdUser = new this.gameModel({ ...createGameInput, userAddresses, bettingTokenDenom});
    return createdUser.save();
  }

  async findGameById(gameId: string): Promise<Game | null> {
    if (!Types.ObjectId.isValid(gameId)) {
      throw new BadRequestException('Invalid gameId format');
    }

    return this.gameModel.findById(gameId).exec(); // 게임을 ID로 찾고 반환
  }

  async joinGame(address: string, gameId: string): Promise<Game> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    if (game.userAddresses.length >= game.limit) {
      throw new BadRequestException('Game limit reached, cannot join.');
    }

    if (game.userAddresses.includes(address)) {
      throw new BadRequestException('User is already in the game.');
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

  async sendMessage(
    gameId: string,
    senderAddress: string,
    content: string,
    messageType: string,
  ): Promise<Message> {
    const game = await this.gameModel.findById(gameId).exec();

    if (!game) {
      throw new BadRequestException('Game not found');
    }

    if (!game.userAddresses.includes(senderAddress)) {
      throw new BadRequestException('Sender is not part of this game');
    }

    return await this.messageService.sendMessage(
      gameId,
      senderAddress,
      content,
      messageType,
    );
  }
}