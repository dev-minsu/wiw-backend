import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Betting, BettingDocument} from "../../domain/models/betting.model";
import {CreateBettingInput} from "../../domain/dto/create-betting.input";

@Injectable()
export class BettingService {
  private readonly logger = new Logger(BettingService.name);

  constructor(@InjectModel(Betting.name) private bettingModel: Model<BettingDocument>) {}

  async create(createBettingInput: CreateBettingInput): Promise<Betting> {
    const result = "TBD";
    const bettingTokenDenom = "MOVE";
    const createdBetting = new this.bettingModel({ ...createBettingInput, bettingTokenDenom, result});
    return createdBetting.save();
  }

  async findBettingsByUserIds(userIds: string[]): Promise<Betting[]> {
    return this.bettingModel.find({ ownerAddress: { $in: userIds } }).exec();
  }

  async findByIds(ids: string[]): Promise<Betting[]> {
    return this.bettingModel.find({ _id: { $in: ids } }).exec();
  }

  async updateResultsById(id: string, result: string): Promise<Betting> {
    return this.bettingModel.findByIdAndUpdate(
      id,
      {result},
      {new: true}
    );
  }
}