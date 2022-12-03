import { apiClient } from '../../api';

interface IGenerateBody {
  peopleNumber: number;
  mealsNumber: number;
  diets: string[];
  intolerances: string[];
  dates: string[];
}

interface IGeneratedWeeklyPlanID {
  id: string;
}

export const generateWeeklyPlan = (token: string, body: IGenerateBody) =>
  apiClient(token)
    .url('/weekly-plans/generate')
    .post(body)
    .json<IGeneratedWeeklyPlanID>();

interface ISwapBody {
  recipeName: string;
}

export const swapRecipe = (token: string, weeklyPlanId: string, body: ISwapBody) =>
  apiClient(token)
    .url(`/${ weeklyPlanId }/swap`)
    .post(body)
    .res();

interface IShoppingListItem {
  name: string;
  amount: number;
  unit: string;
}

export const getShoppingList = (token: string, weeklyPlanId: string) =>
  apiClient(token)
    .url(`/${ weeklyPlanId }/shopping-list`)
    .get()
    .json<IShoppingListItem[]>();

export interface IIngredient {
  name: string;
  amount: number;
  unit: string;
}

export interface IRecipe {
  name: string;
  dietRestrictions: string[];
  intolerances: string[];
  ingredients: IIngredient[];
  instructionURL: string;
  date: string;
}

export interface IWeeklyPlan {
  id: string;
  user: string;
  recipes: IRecipe[];
  mealsNumber: number;
  peopleNumber: number;
}

export const getWeeklyPlan = (token: string, weeklyPlanId: string) => {
  apiClient(token)
    .url(`/${ weeklyPlanId }`)
    .get()
    .json<IWeeklyPlan>();
};