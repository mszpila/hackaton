import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { WeeklyPlanApplicationService, IGeneratedWeeklyPlanID, WeeklyPlanDTO } from '../../application/WeeklyPlanApplicationService';
import { ShoppingListItem } from '../../domain/weeklyPlan/WeeklyPlan';

@Controller('/weekly-plans')
export class WeeklyPlanController {
  constructor(
    private readonly foodApplicationService: WeeklyPlanApplicationService,
  ) {
  }

  @Get('/')
  public async getCurrentWeeklyPlan(
    @Headers('x-token') token: string,
  ): Promise<IGeneratedWeeklyPlanID | null> {
    return this.foodApplicationService.checkCurrentWeeklyPlan({
      token,
    });
  }

  @Post('/generate')
  public async generateRecipes(
    @Headers('x-token') token: string,
    @Body() body: IGenerateBody,
  ): Promise<IGeneratedWeeklyPlanID> {
    return this.foodApplicationService.generateRecipes({
      token,
      ...body,
    });
  }

  @Post('/:weeklyPlan/swap')
  public async swapRecipe(
    @Headers('x-token') token: string,
    @Param('weeklyPlan') weeklyPlan: string,
    @Body() body: ISwapBody,
  ): Promise<void> {
    await this.foodApplicationService.swapRecipe({
      token,
      weeklyPlan,
      ...body,
    });
  }

  @Get('/:weeklyPlan/shopping-list')
  public async getShoppingList(
    @Headers('x-token') token: string,
    @Param('weeklyPlan') weeklyPlan: string,
  ): Promise<ShoppingListItem[]> {
    return this.foodApplicationService.getShoppingList({
      token,
      weeklyPlan,
    });
  }

  @Get('/:weeklyPlan')
  public async getWeeklyPlan(
    @Headers('x-token') token: string,
    @Param('weeklyPlan') weeklyPlan: string,
  ): Promise<WeeklyPlanDTO> {
    return this.foodApplicationService.getWeeklyPlan({
      token,
      weeklyPlan,
    });
  }
}

interface IGenerateBody {
  peopleNumber: number;
  mealsNumber: number;
  diets: string[];
  intolerances: string[];
  dates: string[];
}

interface ISwapBody {
  recipeName: string;
}