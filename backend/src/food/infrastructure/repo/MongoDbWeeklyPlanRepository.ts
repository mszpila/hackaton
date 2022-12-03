import { Inject, Injectable } from '@nestjs/common';
import { Connection, Document, Model, Schema } from 'mongoose';
import { UserID } from '../../../iam/domain/user/User';
import { MongoDbConnection } from '../../../shared/infrastructure/MongoDbConnection';
import { MongoDbTranslator } from '../../../shared/infrastructure/MongoDbTranslator';
import { Recipe, RecipeDietRestriction, RecipeIngredient, RecipeIntolerance, RecipeName } from '../../domain/weeklyPlan/Recipe';
import { WeeklyPlan, WeeklyPlanCookTimes, WeeklyPlanID, WeeklyPlanPeopleNumber } from '../../domain/weeklyPlan/WeeklyPlan';
import { WeeklyPlanRepository } from '../../domain/weeklyPlan/WeeklyPlanRepository';
import { IIngredient, IRecipe, WeeklyPlanSnapshot } from '../../domain/weeklyPlan/WeeklyPlanSnapshot';

interface IWeeklyPlanModel extends Document, WeeklyPlanSnapshot {
  id: string;
  version: number;
}

@Injectable()
export class MongoDbWeeklyPlanRepository implements WeeklyPlanRepository {
  private readonly model: Model<IWeeklyPlanModel>;
  private readonly collectionName = 'weekly_plans';
  private readonly translator = new WeeklyPlanTranslator();

  constructor(
    @Inject(MongoDbConnection) private readonly db: Connection,
  ) {
    const ingredientSchema = new Schema<IIngredient>({
      name: Schema.Types.String,
      amount: Schema.Types.Number,
      unit: Schema.Types.String,
    }, { _id: false, versionKey: false });

    const recipesSchema = new Schema<IRecipe>({
      name: Schema.Types.String,
      dietRestrictions: [Schema.Types.String],
      intolerances: [Schema.Types.String],
      ingredients: [ingredientSchema],
      instructionURL: Schema.Types.String,
      date: Schema.Types.Date,
    }, { _id: false, versionKey: false });

    const weeklyPlanSchema = new Schema<IWeeklyPlanModel>({
      _id: {
        type: Schema.Types.ObjectId,
        alias: 'id',
      },
      user: Schema.Types.ObjectId,
      recipes: [recipesSchema],
    }, { versionKey: 'version' });

    this.model = this.db.model('DefectCard', weeklyPlanSchema, this.collectionName);
  }

  public async get(weeklyPlanId: WeeklyPlanID, userId: UserID): Promise<WeeklyPlan | null> {
    const weeklyPlan = await this.model.findOne({
      _id: weeklyPlanId.toObjectID(),
      user: userId.toObjectID(),
    });

    if (!weeklyPlan) {
      return null;
    }

    return this.translator.toEntity(weeklyPlan);
  }

  public async save(weeklyPlan: WeeklyPlan): Promise<void> {
    await this.model.updateOne(
      { _id: weeklyPlan.id.toObjectID() },
      { ...weeklyPlan.toSnapshot() },
      { upsert: true },
    );
  }

  public async getCurrent(userId: UserID): Promise<WeeklyPlan | null> {
    const weeklyPlan = await this.model.findOne({
      user: userId.toObjectID(),
    });

    if (!weeklyPlan) {
      return null;
    }

    return this.translator.toEntity(weeklyPlan);
  }
}

class WeeklyPlanTranslator implements MongoDbTranslator<WeeklyPlan, WeeklyPlanSnapshot> {
  public toEntity(plainObject: IWeeklyPlanModel): WeeklyPlan {
    return new WeeklyPlan(
      new WeeklyPlanID(plainObject._id),
      new UserID(plainObject.user),
      plainObject.recipes.map(recipe => new Recipe(
        new RecipeName(recipe.name),
        recipe.dietRestrictions as RecipeDietRestriction[],
        recipe.intolerances as RecipeIntolerance[],
        recipe.ingredients.map(ingredient => new RecipeIngredient(
          ingredient.name,
          ingredient.amount,
          ingredient.unit,
        )),
        new URL(recipe.instructionURL),
        new Date(recipe.date),
      )),
      new WeeklyPlanCookTimes(plainObject.cookTimes),
      new WeeklyPlanPeopleNumber(plainObject.peopleNumber),
    );
  }

  public toSnapshot(entity: WeeklyPlan): WeeklyPlanSnapshot {
    return entity.toSnapshot();
  }
}