import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AiAgent} from "../../domain/models/aiagent.model";
import {CreateAiAgentInput} from "../../domain/dto/create-aiagent.input";
import {AiAgentService} from "../../application/services/aiagent.service";
import {UpdateAiAgentInput} from "../../domain/dto/update-aiagent.input";

@Resolver(() => AiAgent)
export class AiAgentResolver {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Mutation(() => AiAgent)
  async createAiAgent(
    @Args('createAiAgentInput') createAiAgentInput: CreateAiAgentInput,
  ): Promise<AiAgent> {
    return this.aiAgentService.create(createAiAgentInput);
  }

  @Query(() => [AiAgent])
  async getAllAiAgent(): Promise<AiAgent[]> {
    return this.aiAgentService.getAllAiAgent()
  }

  @Mutation(() => AiAgent)
  async updateAiAgent(
    @Args('aiAgentId') aiAgentId: string,
    @Args('updateAiAgentInput') updateAiAgentInput: UpdateAiAgentInput
  ): Promise<AiAgent> {
    return this.aiAgentService.updateAiAgent(aiAgentId, updateAiAgentInput);
  }
}
