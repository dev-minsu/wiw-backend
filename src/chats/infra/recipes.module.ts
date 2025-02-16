import {Module} from '@nestjs/common';
import {DateScalar} from '../../common/scalars/date.scalar';
import {RecipesResolver} from '../adapter/primary/recipes.resolver';
import {RecipesService} from '../application/services/recipes.service';

@Module({
  providers: [RecipesResolver, RecipesService, DateScalar],
})
export class RecipesModule {}
