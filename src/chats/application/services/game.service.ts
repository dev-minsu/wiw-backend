import {BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {Game, GameDocument} from "../../domain/models/game.model";
import {CreateGameInput} from "../../domain/dto/create-game.input";
import {MessageService} from "./message.service";
import {Message} from "../../domain/models/message.model";
import {PubSub} from "graphql-subscriptions";
import {BettingService} from "./betting.service";
import {CreateBettingInput} from "../../domain/dto/create-betting.input";
import {Betting, BettingDocument} from "../../domain/models/betting.model";

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private pubSub = new PubSub();

  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>,
              private readonly messageService: MessageService,
              private readonly bettingService: BettingService,
              ) {}

  async create(createGameInput: CreateGameInput): Promise<Game> {
    const { ownerAddress, firstAiAgentId, secondAiAgentId } = createGameInput;
    const userAddresses = [ownerAddress];
    const aiAgentIds = [firstAiAgentId, secondAiAgentId];
    const bettingTokenDenom = "MOVE"
    const createdUser = new this.gameModel({ ...createGameInput, userAddresses, bettingTokenDenom, aiAgentIds});
    return createdUser.save();
  }

  async createBetting(gameId: string, createBettingInput: CreateBettingInput): Promise<Betting> {
    let game = await this.findGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    const existingBettings = await this.bettingService.findByIds(game.bettingIds);
    if (existingBettings.some(b => b.ownerAddress === createBettingInput.ownerAddress)) {
      throw new BadRequestException('A user has already placed a bet in this game.');
    }

    const betting = await this.bettingService.create(createBettingInput);

    await this.appendBettingId(gameId, betting.id);

    game = await this.findGameById(gameId);

    await this.pubSub.publish(`${gameId}`, {newStatus: {event: "create-betting", game}});
    return betting;
  }

  async broadcastEvent(gameId: string, event: string): Promise<void> {
    const game = await this.findGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found.');
    }
    await this.pubSub.publish(`${gameId}`, {newStatus: {event, game}});
  }

  async updateWinnerAiAgent(gameId: string, aiAgentId: string): Promise<Game> {
    const game = await this.gameModel.findById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    if (!game.aiAgentIds.includes(aiAgentId)) {
      throw new BadRequestException('Invalid winner AI Agent ID.');
    }

    const bettings = await this.bettingService.findByIds(game.bettingIds);

    for (const betting of bettings) {
      if (betting.predictionWinnerAiAgentId === aiAgentId) {
        await this.bettingService.updateResultsById(betting.id, "WIN")
      } else {
        await this.bettingService.updateResultsById(betting.id, "LOSE")
      }
    }

    game.winnerAiAgentId = aiAgentId;
    await game.save();

    await this.pubSub.publish(`${gameId}`, { event: "update-winner-ai-agent", game });

    return game;
  }

  async findGameById(gameId: string): Promise<Game | null> {
    if (!Types.ObjectId.isValid(gameId)) {
      throw new BadRequestException('Invalid gameId format');
    }

    return this.gameModel.findById(gameId).exec();
  }


  async appendBettingId(gameId: string, bettingId: string): Promise<void> {
    const game = await this.gameModel.findByIdAndUpdate(
      gameId,
      { $push: { bettingIds: bettingId } },
      { new: true }
    );

    if (!game) {
      throw new NotFoundException('Game not found.');
    }
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

  getPubSub() {
    return this.pubSub;
  }
}