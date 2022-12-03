import { Injectable } from '@nestjs/common';
import { DateValue } from '../../../shared';
import { FoodService } from '../../domain/FoodService';
import { Recipe, RecipeDietRestriction, RecipeIntolerance, RecipeName } from '../../domain/weeklyPlan/Recipe';
import { WeeklyPlanCookTimes } from '../../domain/weeklyPlan/WeeklyPlan';

@Injectable()
export class DummyFoodService implements FoodService {
  public getRandomRecipes(diets: RecipeDietRestriction[], intolerances: RecipeIntolerance[], amount: WeeklyPlanCookTimes): Promise<Recipe[]> {
    return Promise.resolve([new Recipe(
      new RecipeName('test'),
      [],
      [],
      [],
      new URL('https://example.com'),
      new DateValue(new Date()),
    )]);
  }
}