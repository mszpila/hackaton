import { UnprocessableEntityException } from '@nestjs/common';

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

export enum RecipeIntolerance {
  DAIRY_FREE = 'DAIRY_FREE',
  GLUTEN_FREE = 'GLUTEN_FREE',
}

export enum RecipeDietRestriction {
  KETOGENIC = 'KETOGENIC',
  VEGAN = 'VEGAN',
  VEGETARIAN = 'VEGETARIAN',
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
    private date: Date,
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

  public getDate(): Date {
    return this.date;
  }
}