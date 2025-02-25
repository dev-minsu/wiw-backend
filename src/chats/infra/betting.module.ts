import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {BettingService} from "../application/services/betting.service";
import {Betting, BettingSchema} from "../domain/models/betting.model";

@Module({
  imports: [MongooseModule.forFeature([{ name: Betting.name, schema: BettingSchema }])],
  providers: [BettingService],
  exports: [BettingService],
})
export class BettingModule {}