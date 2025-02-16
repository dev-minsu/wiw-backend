import {Module} from '@nestjs/common';
import {UserResolver} from "../adapter/primary/user.resolver";

@Module({
  providers: [UserResolver],
})
export class UsersModule {}
