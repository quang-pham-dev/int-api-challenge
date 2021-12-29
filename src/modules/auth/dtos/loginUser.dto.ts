import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { ILoginUserDto } from '../interfaces/loginUser-dto.interface';

export class LoginUserDto implements ILoginUserDto {
  @ApiProperty({ example: 'quangpn1@email.com', description: 'email' })
  @IsEmail()
  readonly emailAddress: string;

  @ApiProperty({ example: '123456@abc', description: 'Password' })
  readonly password: string;
}
