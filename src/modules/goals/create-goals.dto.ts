import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { ICreateGoalDto } from './create-goals.interface';

export class CreateGoalDto implements ICreateGoalDto {
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
}
