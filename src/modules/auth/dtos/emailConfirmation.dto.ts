import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EmailConfirmationDto {
  @ApiProperty({ description: 'The token of the Email' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export default EmailConfirmationDto;
