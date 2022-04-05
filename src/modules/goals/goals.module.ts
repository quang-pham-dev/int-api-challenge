import { Module } from '@nestjs/common';

import { TypegooseModule } from 'nestjs-typegoose';

import { GoalsController } from './goals.controller';
import { GoalsModel } from './goals.model';
import { GoalsService } from './goals.service';

@Module({
  imports: [TypegooseModule.forFeature([GoalsModel])],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
