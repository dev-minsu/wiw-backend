import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CreateAiAgentInput} from "../../domain/dto/create-aiagent.input";
import {AiAgent, AiAgentDocument} from "../../domain/models/aiagent.model";
import {UpdateAiAgentInput} from "../../domain/dto/update-aiagent.input";

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);

  constructor(@InjectModel(AiAgent.name) private aiAgentModel: Model<AiAgentDocument>) {}

  async create(createAiAgentInput: CreateAiAgentInput): Promise<AiAgent> {
    const createdAiAgent = new this.aiAgentModel({ ...createAiAgentInput});
    return createdAiAgent.save();
  }

  async getAllAiAgent(): Promise<AiAgent[]> {
    return this.aiAgentModel.find().exec();
  }

  async findByIds(aiAgentIds: string[]): Promise<AiAgent[]> {
    return this.aiAgentModel.find({ _id: { $in: aiAgentIds } }).exec();
  }

  async updateAiAgent(aiAgentId: string, updateAiAgentInput: UpdateAiAgentInput): Promise<AiAgent> {
    const updatedAiAgent = await this.aiAgentModel.findByIdAndUpdate(
      aiAgentId,
      { $set: updateAiAgentInput }, // ✅ 입력된 값만 업데이트
      { new: true, omitUndefined: true } // ✅ 업데이트 후 최신 데이터 반환 & undefined 값 무시
    );

    if (!updatedAiAgent) {
      throw new NotFoundException("AI Agent not found.");
    }

    return updatedAiAgent;
  }
}