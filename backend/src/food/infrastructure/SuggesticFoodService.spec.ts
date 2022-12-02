import { SuggesticFoodService } from './SuggesticFoodService';

describe('FoodService', () => {
  let foodService: SuggesticFoodService;

  beforeAll(() => {
    foodService = new SuggesticFoodService();
  });

  it('simple test', async () => {
    await foodService.getMealPlan();
  });
});