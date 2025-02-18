import {Module} from '@nestjs/common';
import {UserResolver} from "../adapter/primary/user.resolver";
import {UserService} from "../application/services/user.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../domain/models/user.model";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
