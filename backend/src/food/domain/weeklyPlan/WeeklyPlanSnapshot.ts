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

export class WeeklyPlanSnapshot {
  constructor(
    public readonly id: string,
    public readonly user: string,
    public readonly recipes: IRecipe[],
    public readonly cookTimes: number,
    public readonly peopleNumber: number,
  ) {
  }
}