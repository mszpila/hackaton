import { IsArray, IsNumber, IsString } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { TokenID } from '../../iam/domain/token/Token';
import { TokenService } from '../../iam/domain/token/TokenService';
import { DateValue } from '../../shared';
import { RecipeDietRestriction, RecipeIntolerance, RecipeName } from '../domain/weeklyPlan/Recipe';
import { WeeklyPlan, WeeklyPlanCookTimes, WeeklyPlanDays, WeeklyPlanID, WeeklyPlanPeopleNumber } from '../domain/weeklyPlan/WeeklyPlan';
import { WeeklyPlanService } from '../domain/weeklyPlan/WeeklyPlanService';

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
  constructor(weeklyPlan: WeeklyPlan) {
    const snap = weeklyPlan.toSnapshot();
  }
}

@Injectable()
export class WeeklyPlanApplicationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly weeklyPlanService: WeeklyPlanService,
  ) {
  }

  public async generateRecipes(command: GenerateWeeklyPlanCommand): Promise<IGeneratedWeeklyPlanID> {
    const user = await this.tokenService.getUser(new TokenID(command.token), null);

    const diets = command.diets.map(diet => new RecipeDietRestriction(diet));
    const intolerances = command.intolerances.map(intolerance => new RecipeIntolerance(intolerance));
    const cookTimes = new WeeklyPlanCookTimes(command.mealsNumber);
    const peopleNumber = new WeeklyPlanPeopleNumber(command.peopleNumber);
    const dates = new WeeklyPlanDays(command.dates.map(date => new DateValue(date)));

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
}

export interface IGeneratedWeeklyPlanID {
  id: string;
}