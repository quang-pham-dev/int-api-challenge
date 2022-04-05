import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './create-goals.dto';
import { UpdateGoalDto } from './update-goals.dto';
import { RequestWithUser } from '@modules/auth/interfaces/request-with-user.interface';

@Controller('goals')
@ApiTags('goals')
export class GoalsController {
  constructor(private readonly goalService: GoalsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessTokenGuard)
  async createNewGoal(@Req() req: RequestWithUser, @Body() createGoalInfo: CreateGoalDto) {
    const goal = await this.goalService.createNewGoal(createGoalInfo, req?.user?.id);
    return { goal };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessTokenGuard)
  async getAllGoals(@Req() req: RequestWithUser) {
    const goals = await this.goalService.getAllGoals(req.user.id);
    return { goals };
  }

  @Put(':id')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async updateGoal(@Param('id') goalId: string, @Body() updateGoalInfo: UpdateGoalDto) {
    const updatedGoal = await this.goalService.updateGoal(goalId, updateGoalInfo);
    return { updatedGoal };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessTokenGuard)
  async deleteGoal(@Param('id') goalId: string) {
    await this.goalService.deleteGoal(goalId);
    return { id: goalId };
  }
}
