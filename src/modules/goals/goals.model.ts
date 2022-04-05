import { DocumentType, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { IBaseModel } from '@interfaces/base-model.interface';
import { IGoal } from './goals-model.interface';
import { User } from '@modules/users/models/user.model';

export type GoalsDocument = DocumentType<GoalsModel>;

@modelOptions({ options: { customName: 'Goal', allowMixed: Severity.ALLOW } })
export class GoalsModel implements IGoal, IBaseModel {
  @prop({ unique: true })
  id: string;

  @prop()
  title: string;

  @prop()
  description: string;

  @prop({ ref: () => User, type: () => String })
  user: Ref<User, string>;

  @prop({ default: Date })
  createdAt: string;

  @prop({ default: Date })
  updatedAt: string;

  @prop({ default: Date })
  deletedAt: string;
}
