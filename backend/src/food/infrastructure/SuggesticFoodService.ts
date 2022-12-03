import { Suggestic } from '@suggestic/sdk';

export class SuggesticFoodService {
  private readonly suggesticClient: Suggestic;

  constructor() {
    this.suggesticClient = new Suggestic('5c646682fe8422782fdd3e5557aa85bce7b80c36');
  }

  public async createUser(name: string, email: string): Promise<any> {
    console.log(this.suggesticClient);
    const user = await this.suggesticClient.createUser({
      email,
      name,
    });
    console.log(user);
  }

  public async getMealPlan(): Promise<any> {
    // // const meal = await this.suggesticClient.mealPlan();
    // const user = await this.suggesticClient.getUser("0b64d67d-a667-40d0-b9c7-ff811a6e3065");
    // console.log('user', user);
    // // const mealPlan = await user.mealPlan();
    // // console.log('mealPlan', mealPlan);
    // // console.log(meal);
    const user = this.suggesticClient.getUser('0b64d67d-a667-40d0-b9c7-ff811a6e3065');
    const mealplan = await user.mealPlan({
      fromDate: new Date().toISOString(),
    });
    console.log(mealplan);
  }
}