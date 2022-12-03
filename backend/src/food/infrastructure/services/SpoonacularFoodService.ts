import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FoodService } from '../../domain/FoodService';
import { Recipe, RecipeDietRestriction, RecipeIngredient, RecipeIntolerance, RecipeName } from '../../domain/weeklyPlan/Recipe';
import { WeeklyPlanCookTimes, WeeklyPlanDays } from '../../domain/weeklyPlan/WeeklyPlan';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch-commonjs');

interface IExtendedIngredients {
  name: string;
  amount: number;
  unit: string;
}

interface ISpoonacularRecipe {
  title: string;
  sourceUrl: string;
  dairyFree: boolean,
  glutenFree: boolean,
  ketogenic: boolean,
  vegan: boolean,
  vegetarian: boolean,
  extendedIngredients: IExtendedIngredients[]
}

@Injectable()
export class SpoonacularFoodService implements FoodService {
  private readonly endpoint = 'https://api.spoonacular.com/recipes/random';
  private readonly token = process.env.SPOONACULAR_TOKEN;

  constructor() {

    if (!this.token) {
      throw new InternalServerErrorException('SpoonacularFoodService token is undefined');
    }
  }

  public async getRandomRecipes(diets: RecipeDietRestriction[], intolerances: RecipeIntolerance[], amount: WeeklyPlanCookTimes, dates: WeeklyPlanDays): Promise<Recipe[]> {
    const plainRecipes = await this.get<ISpoonacularRecipe[]>(`tags=main%20course,${ diets.length ? diets.map(diet => diet.toString()) : null },${ intolerances.length ? intolerances.map(intolerance => intolerance.toString()) : null }&limitLicense=true&number=${ amount.getCookTimes() }`);
    const dateValues = dates.getDates();

    return plainRecipes.map(recipe => {
      const intolerances: RecipeIntolerance[] = [];
      const dietRestrictions: RecipeDietRestriction[] = [];

      if (recipe.dairyFree) intolerances.push(RecipeIntolerance.DAIRY_FREE);
      if (recipe.glutenFree) intolerances.push(RecipeIntolerance.GLUTEN_FREE);

      if (recipe.ketogenic) dietRestrictions.push(RecipeDietRestriction.KETOGENIC);
      if (recipe.vegan) dietRestrictions.push(RecipeDietRestriction.VEGAN);
      if (recipe.vegetarian) dietRestrictions.push(RecipeDietRestriction.VEGETARIAN);

      const ingredients = recipe.extendedIngredients.map(ingredient => new RecipeIngredient(
        ingredient.name,
        ingredient.amount,
        ingredient.unit,
      ));

      return new Recipe(
        new RecipeName(recipe.title),
        dietRestrictions,
        intolerances,
        ingredients,
        new URL(recipe.sourceUrl),
        dateValues.pop() || new Date(),
      );
    });
  }

  private async get<T>(query: string): Promise<T> {
    const response = await fetch(`${ this.endpoint }?${ query }`, {
      method: 'get',
      headers: {
        'x-api-key': this.token!,
      },
    });

    const data = await response.json();
    return data.recipes as T;
  }
}