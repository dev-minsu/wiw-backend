import {Args, Query, Resolver} from '@nestjs/graphql';
import {User} from "../../domain/models/user.model";

@Resolver(() => User)
export class UserResolver {
  // constructor(private readonly recipesService: RecipesService) {}

  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    return null
  }
}
