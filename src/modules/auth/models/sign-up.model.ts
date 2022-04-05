import { ISignUp } from './../interfaces/signUp.interface';
import { IBaseModel } from '@interfaces/base-model.interface';
import { RoleType } from '@modules/users/role-type.enum';
import { DocumentType, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { hashSync } from 'bcrypt';

export type AuthDocument = DocumentType<Auth>;

@modelOptions({ options: { customName: 'Auth', allowMixed: Severity.ALLOW } })
export class Auth implements ISignUp, IBaseModel {
  @prop({ unique: true })
  id: string;

  @prop({ default: RoleType.USER })
  role: Ref<RoleType>;

  @prop({ required: true, trim: true })
  firstName: string;

  @prop({ trim: true })
  lastName: string;

  @prop({ required: true, trim: true })
  emailAddress: string;

  @prop({
    select: false,
    get(val) {
      return val;
    },
    set(val) {
      return hashSync(val, 10);
    },
    required: true,
  })
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
  createdAt: string;

  @prop({ default: Date })
  updatedAt: string;

  @prop({ default: Date })
  deletedAt: string;
}
