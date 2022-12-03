import { IsArray, IsNumber, IsString } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { TokenID } from '../../iam/domain/token/Token';
import { TokenService } from '../../iam/domain/token/TokenService';
import { RecipeDietRestriction, RecipeIntolerance, RecipeName } from '../domain/weeklyPlan/Recipe';
import { ShoppingListItem, WeeklyPlan, WeeklyPlanCookTimes, WeeklyPlanDays, WeeklyPlanID, WeeklyPlanPeopleNumber } from '../domain/weeklyPlan/WeeklyPlan';
import { WeeklyPlanRepository } from '../domain/weeklyPlan/WeeklyPlanRepository';
import { WeeklyPlanService } from '../domain/weeklyPlan/WeeklyPlanService';
import { IRecipe } from '../domain/weeklyPlan/WeeklyPlanSnapshot';

export class TokenCommand {
  @IsString()
  readonly token: string;
}

export class GenerateWeeklyPlanCommand extends TokenCommand {
  @IsNumber()
  readonly peopleNumber: number;

  @IsNumber()
  readonly mealsNumber: number;

  @IsArray()
  @IsString({ each: true })
  readonly diets: string[];

  @IsArray()
  @IsString({ each: true })
  readonly intolerances: string[];

  @IsArray()
  @IsString({ each: true })
  readonly dates: string[];
}

export class SwapRecipeCommand extends TokenCommand {
  @IsString()
  readonly weeklyPlan: string;

  @IsString()
  readonly recipeName: string;
}

export class GetWeeklyPlanCommand extends TokenCommand {
  @IsString()
  readonly weeklyPlan: string;
}

export class WeeklyPlanDTO {
  public readonly id: string;
  public readonly user: string;
  public readonly recipes: IRecipe[];
  public readonly mealsNumber: number;
  public readonly peopleNumber: number;

  constructor(weeklyPlan: WeeklyPlan) {
    const snap = weeklyPlan.toSnapshot();

    this.id = snap.id;
    this.user = snap.user;
    this.recipes = snap.recipes;
    this.mealsNumber = snap.cookTimes;
    this.peopleNumber = snap.peopleNumber;
  }
}

@Injectable()
export class WeeklyPlanApplicationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly weeklyPlanService: WeeklyPlanService,
    private readonly weeklyPlanRepository: WeeklyPlanRepository,
  ) {
  }

  public async generateRecipes(command: GenerateWeeklyPlanCommand): Promise<IGeneratedWeeklyPlanID> {
    const user = await this.tokenService.getUser(new TokenID(command.token), null);

    const diets = command.diets as RecipeDietRestriction[];
    const intolerances = command.intolerances as RecipeIntolerance[];
    const cookTimes = new WeeklyPlanCookTimes(command.mealsNumber);
    const peopleNumber = new WeeklyPlanPeopleNumber(command.peopleNumber);
    const dates = new WeeklyPlanDays(command.dates.map(date => new Date(date)));

    const weeklyPlan = await this.weeklyPlanService.createWeeklyPlan(
      user.id,
      diets,
      intolerances,
      cookTimes,
      peopleNumber,
      dates,
    );

    return { id: weeklyPlan.id.toString() };
  }

  public async swapRecipe(command: SwapRecipeCommand): Promise<void> {
    const user = await this.tokenService.getUser(new TokenID(command.token), null);
    const recipeName = new RecipeName(command.recipeName);

    await this.weeklyPlanService.swapRecipe(new WeeklyPlanID(command.weeklyPlan), user.id, recipeName);
  }

  public async getWeeklyPlan(command: GetWeeklyPlanCommand): Promise<WeeklyPlanDTO> {
    const user = await this.tokenService.getUser(new TokenID(command.token), null);
    const weeklyPlan = await this.weeklyPlanService.getWeeklyPlan(new WeeklyPlanID(command.weeklyPlan), user.id);

    return new WeeklyPlanDTO(weeklyPlan);
  }

  public async getShoppingList(command: GetWeeklyPlanCommand): Promise<ShoppingListItem[]> {
    const user = await this.tokenService.getUser(new TokenID(command.token), null);
    const weeklyPlan = await this.weeklyPlanService.getWeeklyPlan(new WeeklyPlanID(command.weeklyPlan), user.id);

    return weeklyPlan.getShoppingList();
  }

  public async checkCurrentWeeklyPlan(command: TokenCommand): Promise<IGeneratedWeeklyPlanID | null> {
    const user = await this.tokenService.getUser(new TokenID(command.token), null);

    const weeklyPlan = await this.weeklyPlanRepository.getCurrent(user.id);

    if (!weeklyPlan) return null;

    return { id: weeklyPlan.id.toString() };
  }
}

export interface IGeneratedWeeklyPlanID {
  id: string;
}