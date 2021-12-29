export interface ISignUpDto {
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
