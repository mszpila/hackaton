import { UnprocessableEntityException } from '@nestjs/common';
import { DateValue, Enum } from '../../../shared';

export class RecipeName {
  constructor(
    private readonly name: string,
  ) {
    if (!name) {
      throw new UnprocessableEntityException('Name cannot be empty');
    }
  }

  public toString(): string {
    return this.name;
  }
}

@Enum.decorate()
export class RecipeIntolerance extends Enum {
  public static readonly DAIRY_FREE = new RecipeIntolerance('DAIRY_FREE');
  public static readonly GLUTEN_FREE = new RecipeIntolerance('GLUTEN_FREE');
}

@Enum.decorate()
export class RecipeDietRestriction extends Enum {
  public static readonly KETOGENIC = new RecipeDietRestriction('KETOGENIC');
  public static readonly VEGAN = new RecipeDietRestriction('VEGAN');
  public static readonly VEGETARIAN = new RecipeDietRestriction('VEGETARIAN');
}

export class RecipeIngredient {
  constructor(
    private readonly name: string,
    private readonly amount: number,
    private readonly unit: string,
  ) {
  }

  public getName(): string {
    return this.name;
  }

  public getAmountWithUnit(): string {
    return `${ this.amount } ${ this.unit }`;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getUnit(): string {
    return this.unit;
  }
}

export class Recipe {
  constructor(
    private name: RecipeName,
    private dietRestrictions: RecipeDietRestriction[],
    private intolerances: RecipeIntolerance[],
    private ingredients: RecipeIngredient[],
    private instructionURL: URL,
    private date: DateValue,
  ) {
  }

  public getName(): RecipeName {
    return this.name;
  }

  public getRestrictions(): RecipeDietRestriction[] {
    return this.dietRestrictions;
  }

  public getIntolerances(): RecipeIntolerance[] {
    return this.intolerances;
  }

  public getIngredients(): RecipeIngredient[] {
    return this.ingredients;
  }

  public getInstructionURL(): URL {
    return this.instructionURL;
  }

  public getDate(): DateValue {
    return this.date;
  }
}