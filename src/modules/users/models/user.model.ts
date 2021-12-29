import { IBaseModel } from '@interfaces/base-model.interface';
import { DocumentType, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { IUserModel } from '../interfaces/users-model.interface';
import { RoleType } from '../role-type.enum';

export type UserDocument = DocumentType<User>;

@modelOptions({ options: { customName: 'User', allowMixed: Severity.ALLOW } })
export class User implements IUserModel, IBaseModel {
  @prop({ unique: true })
  id: string;

  @prop({ default: RoleType.USER })
  role: Ref<RoleType>;

  @prop({ required: true, trim: true })
  firstName: string;

  @prop({ trim: true })
  lastName: string;

  @prop({ trim: true })
  sex: string;

  @prop({ required: true, trim: true })
  emailAddress: string;

  @prop({ required: true, trim: true })
  password: string;

  @prop()
  phoneNumber: string;

  @prop({ default: false })
  deleteFlag: boolean;

  @prop({ default: false })
  isEmailConfirmed?: boolean;

  @prop()
  currentHashedRefreshToken?: string;

  @prop({ default: Date })
  createdAt: Date;

  @prop({ default: Date })
  updatedAt: Date;

  @prop({ default: Date })
  deletedAt: Date;
}
