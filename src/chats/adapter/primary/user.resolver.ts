import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User} from "../../domain/models/user.model";
import {NewUserInput} from "../../domain/dto/new-user.input";
import {UserService} from "../../application/services/user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return null
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.findAll()
  }


  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: NewUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }
}
