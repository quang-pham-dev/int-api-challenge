import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EmailResendDto {
  @ApiProperty({ example: 'quangpn1@email.com', description: 'email' })
  @IsString()
  @IsNotEmpty()
  emailAddress: string;
}

export default EmailResendDto;
