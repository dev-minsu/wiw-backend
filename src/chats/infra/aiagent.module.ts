import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {AiAgentResolver} from "../adapter/primary/aiagent.resolver";
import {AiAgentService} from "../application/services/aiagent.service";
import {AiAgent, AiAgentSchema} from "../domain/models/aiagent.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiAgent.name, schema: AiAgentSchema }]),
  ],
  providers: [AiAgentResolver, AiAgentService],
  exports: [AiAgentService],
})
export class AiAgentModule {}