export interface ISignUp {
  emailAddress: string;

  firstName: string;

  lastName: string;

  password: string;

  deleteFlag?: boolean;

  isEmailConfirmed?: boolean;
}
