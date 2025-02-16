import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { NewRecipeInput } from '../../domain/dto/new-recipe.input';
import { RecipesArgs } from '../../domain/dto/recipes.args';
import { Recipe } from '../../domain/models/recipe.model';
import { RecipesService } from '../../application/services/recipes.service';

// const pubSub = new PubSub();

@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Query(() => Recipe)
  async recipe(@Args('id') id: string): Promise<Recipe> {
    const recipe = await this.recipesService.findOneById(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  @Query(() => Recipe)
  async recipe2(@Args('id') id: string): Promise<Recipe> {
    return null;
  }
  //
  // @Query(returns => [Recipe])
  // recipes(@Args() recipesArgs: RecipesArgs): Promise<Recipe[]> {
  //   return this.recipesService.findAll(recipesArgs);
  // }
  //
  // @Mutation(returns => Recipe)
  // async addRecipe(
  //   @Args('newRecipeData') newRecipeData: NewRecipeInput,
  // ): Promise<Recipe> {
  //   const recipe = await this.recipesService.create(newRecipeData);
  //   pubSub.publish('recipeAdded', { recipeAdded: recipe });
  //   return recipe;
  // }
  //
  @Mutation(() => Boolean)
  async removeRecipe(@Args('id') id: string) {
    return this.recipesService.remove(id);
  }
  //
  // @Subscription(returns => Recipe)
  // recipeAdded() {
  //   return pubSub.asyncIterator('recipeAdded');
  // }
}
