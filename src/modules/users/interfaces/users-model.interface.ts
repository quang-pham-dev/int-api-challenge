export interface IUserModel {
  firstName: string;

  lastName: string;

  sex: string;

  emailAddress: string;

  password: string;

  phoneNumber: string;

  deleteFlag: boolean;

  isEmailConfirmed?: boolean;

  currentHashedRefreshToken?: string;
}
