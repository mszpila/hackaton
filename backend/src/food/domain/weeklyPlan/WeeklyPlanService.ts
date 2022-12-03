import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserID } from '../../../iam/domain/user/User';
import { FoodService } from '../FoodService';
import { RecipeDietRestriction, RecipeIntolerance, RecipeName } from './Recipe';
import { WeeklyPlan, WeeklyPlanCookTimes, WeeklyPlanDays, WeeklyPlanID, WeeklyPlanPeopleNumber } from './WeeklyPlan';
import { WeeklyPlanRepository } from './WeeklyPlanRepository';

@Injectable()
export class WeeklyPlanService {
  constructor(
    private readonly foodService: FoodService,
    private readonly weeklyPlanRepository: WeeklyPlanRepository,
  ) {
  }

  public async createWeeklyPlan(
    userId: UserID,
    diets: RecipeDietRestriction[],
    intolerances: RecipeIntolerance[],
    cookTimes: WeeklyPlanCookTimes,
    peopleNumber: WeeklyPlanPeopleNumber,
    dates: WeeklyPlanDays,
  ): Promise<WeeklyPlan> {
    if (cookTimes.getCookTimes() !== dates.getAmountOfDates()) {
      throw new UnprocessableEntityException(`Amount of cook times and chosen dates has to be the same, cook times: ${ cookTimes.getCookTimes() }, dates: ${ dates.getAmountOfDates() }`);
    }

    const recipes = await this.foodService.getRandomRecipes(diets, intolerances, cookTimes, dates);
    const weeklyPlan = new WeeklyPlan(
      new WeeklyPlanID(),
      userId,
      recipes,
      cookTimes,
      peopleNumber,
    );

    await this.weeklyPlanRepository.save(weeklyPlan);

    return weeklyPlan;
  }

  public async swapRecipe(weeklyPlanId: WeeklyPlanID, userId: UserID, recipeName: RecipeName): Promise<void> {
    const weeklyPlan = await this.weeklyPlanRepository.get(weeklyPlanId, userId);

    if (!weeklyPlan) {
      throw new NotFoundException(`Weekly plan with id ${ weeklyPlanId.toString() } not found`);
    }

    const recipe = weeklyPlan.getRecipes().find(recipe => recipe.getName().toString() === recipeName.toString());

    if (!recipe) {
      throw new NotFoundException(`Recipe with name ${ recipeName.toString() } not found`);
    }

    const [newRecipe] = await this.foodService.getRandomRecipes(recipe.getRestrictions(), recipe.getIntolerances(), new WeeklyPlanCookTimes(1), new WeeklyPlanDays([recipe.getDate()]));
    weeklyPlan.swapRecipe(recipeName, newRecipe);

    await this.weeklyPlanRepository.save(weeklyPlan);
  }

  public async getWeeklyPlan(weeklyPlanId: WeeklyPlanID, userId: UserID): Promise<WeeklyPlan> {
    const weeklyPlan = await this.weeklyPlanRepository.get(weeklyPlanId, userId);

    if (!weeklyPlan) {
      throw new NotFoundException(`Weekly plan with id ${ weeklyPlanId.toString() } not found`);
    }

    return weeklyPlan;
  }
}