import { UnprocessableEntityException } from '@nestjs/common';
import { UserID } from '../../../iam/domain/user/User';
import { Entity, Identifier } from '../../../shared';
import { Recipe, RecipeName } from './Recipe';
import { WeeklyPlanSnapshot } from './WeeklyPlanSnapshot';

export class WeeklyPlanID extends Identifier {
}

export class WeeklyPlanCookTimes {
  constructor(
    private readonly times: number,
  ) {
    if (times < 1) {
      throw new UnprocessableEntityException('Cook times cannot be lower than 1');
    }

    if (times > 7) {
      throw new UnprocessableEntityException('Cook times cannot be greater than 14');
    }
  }

  public getCookTimes(): number {
    return this.times;
  }
}

export class WeeklyPlanPeopleNumber {
  constructor(
    private readonly peopleNumber: number,
  ) {
    if (peopleNumber < 1) {
      throw new UnprocessableEntityException('Number of people cannot be lower than 1');
    }

    if (peopleNumber > 4) {
      throw new UnprocessableEntityException('Number of people cannot be greater than 4');
    }
  }

  public getNumberOfPeople(): number {
    return this.peopleNumber;
  }
}

export class WeeklyPlanDays {
  constructor(
    private readonly dates: Date[],
  ) {
    if (dates.length < 1) {
      throw new UnprocessableEntityException('Number of dates cannot be lower than 1');
    }

    if (dates.length > 7) {
      throw new UnprocessableEntityException('Number of dates cannot be greater than 7');
    }
  }

  public getDates(): Date[] {
    return this.dates;
  }

  public getAmountOfDates(): number {
    return this.dates.length;
  }
}

export interface ShoppingListItem {
  name: string;
  amount: number;
  unit: string;
}

export class WeeklyPlan extends Entity<WeeklyPlanID, WeeklyPlanSnapshot> {
  constructor(
    id: WeeklyPlanID,
    private user: UserID,
    private recipes: Recipe[],
    private cookTimes: WeeklyPlanCookTimes,
    private peopleNumber: WeeklyPlanPeopleNumber,
  ) {
    super(id);
  }

  public toSnapshot(): WeeklyPlanSnapshot {
    return new WeeklyPlanSnapshot(
      this.id.toString(),
      this.user.toString(),
      this.recipes.map(recipe => ({
        name: recipe.getName().toString(),
        dietRestrictions: recipe.getRestrictions().map(diet => diet.toString()),
        intolerances: recipe.getIntolerances().map(intolerance => intolerance.toString()),
        ingredients: recipe.getIngredients().map(ingredient => ({
          name: ingredient.getName(),
          amount: ingredient.getAmount(),
          unit: ingredient.getUnit(),
        })),
        instructionURL: recipe.getInstructionURL().toString(),
        date: recipe.getDate().toISOString(),
      })),
      this.cookTimes.getCookTimes(),
      this.peopleNumber.getNumberOfPeople(),
    );
  }

  public getShoppingList(): ShoppingListItem[] {
    const items: Map<string, ShoppingListItem> = new Map();

    for (const recipe of this.recipes) {
      for (const ingredient of recipe.getIngredients()) {
        const ingredientName = ingredient.getName();

        if (items.has(ingredientName)) {
          const { name, amount, unit } = items.get(ingredientName)!;
          items.set(
            ingredientName,
            { name: name, amount: ingredient.getAmount() + amount, unit },
          );

          continue;
        }

        items.set(ingredientName, {
          name: ingredientName,
          amount: ingredient.getAmount(),
          unit: ingredient.getUnit(),
        });
      }
    }

    const shoppingItems: ShoppingListItem[] = [];

    for (const item of items.values()) {
      const { name, amount, unit } = item;
      shoppingItems.push({
        name,
        amount,
        unit,
      });
    }

    return shoppingItems;
  }

  public getRecipes(): Recipe[] {
    return this.recipes;
  }

  public swapRecipe(recipeName: RecipeName, newRecipe: Recipe): void {
    this.recipes = this.recipes.map(recipe => {
      if (recipe.getName().toString() === recipeName.toString()) {
        return newRecipe;
      }

      return recipe;
    });

  }

  private calculateAmount(aggregatedAmount: number): number {
    return aggregatedAmount * this.peopleNumber.getNumberOfPeople() * this.cookTimes.getCookTimes();
  }
}