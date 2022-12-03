import { Injectable } from '@nestjs/common';
import { UserID } from '../../../iam/domain/user/User';
import { WeeklyPlan, WeeklyPlanID } from './WeeklyPlan';

@Injectable()
export abstract class WeeklyPlanRepository {
  public abstract save(weeklyPlan: WeeklyPlan): Promise<void>;

  public abstract get(weeklyPlanId: WeeklyPlanID, userId: UserID): Promise<WeeklyPlan | null>;
}