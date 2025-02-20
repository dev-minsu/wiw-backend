import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User} from "../../domain/models/user.model";
import {CreateUserInput} from "../../domain/dto/create-user.input";
import {UserService} from "../../application/services/user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  async findUserByAddress(@Args('address') address: string): Promise<User | null> {
    return this.userService.findUserByAddress(address);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }
}
