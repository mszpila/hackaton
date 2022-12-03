import { Injectable } from '@nestjs/common';
import { Recipe, RecipeDietRestriction, RecipeIntolerance } from './weeklyPlan/Recipe';
import { WeeklyPlanCookTimes, WeeklyPlanDays } from './weeklyPlan/WeeklyPlan';

@Injectable()
export abstract class FoodService {
  public abstract getRandomRecipes(diet: RecipeDietRestriction[], intolerance: RecipeIntolerance[], amount: WeeklyPlanCookTimes, dates: WeeklyPlanDays): Promise<Recipe[]>;
}