import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { GoalsModel } from './goals.model';
import { CreateGoalDto } from './create-goals.dto';
import { UpdateGoalDto } from './update-goals.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(GoalsModel)
    private readonly goalsModel: ReturnModelType<typeof GoalsModel>,
  ) {}

  async createNewGoal(
    createGoalInfo: CreateGoalDto,
    userId: string,
  ): Promise<GoalsModel | undefined> {
    try {
      const newGoal = await this.goalsModel.create({
        id: nanoid(24),
        ...createGoalInfo,
        user: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return newGoal;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllGoals(id: string): Promise<any> {
    const allGoals = await this.goalsModel.find({ user: id });
    return allGoals;
  }

  async updateGoal(goalId: string, updateGoalInfo: UpdateGoalDto): Promise<any> {
    try {
      const foundGoal = await this.goalsModel.findOne({ id: goalId });

      if (!foundGoal) {
        throw new NotFoundException('Goal with this id does not exist');
      }

      updateGoalInfo.updatedAt = new Date().toISOString();
      const updatedGoal = await this.goalsModel.updateOne(
        { id: goalId },
        {
          ...updateGoalInfo,
        },
      );
      return updatedGoal;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteGoal(goalId: string): Promise<any> {
    try {
      const foundGoal = await this.goalsModel.findOne({ id: goalId });
      if (!foundGoal) {
        throw new NotFoundException('Goal with this id does not exist');
      }
      const deletedGoal = await this.goalsModel.deleteOne(
        { id: goalId },
        {
          ...foundGoal,
        },
      );
      return deletedGoal;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
