import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { IUpdateGoalDto } from './update-goals.interface';

export class UpdateGoalDto implements IUpdateGoalDto {
  @ApiProperty({
    description: 'The Goal Title of the Goal',
  })
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the Goal',
  })
  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The updatedAt of the Goal',
  })
  updatedAt: string;
}
