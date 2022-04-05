import { IBaseModel } from '@interfaces/base-model.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { IUserModel } from '../interfaces/users-model.interface';
import { RoleType } from '../role-type.enum';

export type UserDocument = DocumentType<User>;

@modelOptions({ options: { customName: 'User', allowMixed: Severity.ALLOW } })
export class User implements IUserModel, IBaseModel {
  @prop({ unique: true })
  id: string;

  @ApiProperty({ example: 'USER', description: 'role' })
  @prop({ default: RoleType.USER })
  role: Ref<RoleType>;

  @ApiProperty({ example: 'william', description: 'First Name' })
  @prop({ required: true, trim: true })
  firstName: string;

  @ApiProperty({ example: 'Pham', description: 'Last Name' })
  @prop({ trim: true })
  lastName: string;

  @ApiProperty({ example: 'quangpn1@email', description: 'email address' })
  @prop({ required: true, trim: true })
  emailAddress: string;

  @ApiProperty({ example: 'quangpn1@bac', description: 'password' })
  @prop({ required: true, trim: true })
  password: string;

  @ApiProperty({ example: '+84961140590', description: 'Phone number' })
  @prop()
  phoneNumber: string;

  @prop({ default: false })
  deleteFlag: boolean;

  @prop({ default: false })
  isEmailConfirmed?: boolean;

  @prop()
  currentHashedRefreshToken?: string;

  @prop({ default: Date })
  createdAt: string;

  @prop({ default: Date })
  updatedAt: string;

  @prop({ default: Date })
  deletedAt: string;
}
