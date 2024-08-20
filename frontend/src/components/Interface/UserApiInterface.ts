
export interface SignUpUserProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword:string
}



export interface LogInUserProps {
  emailAddress: string;
  password: string;
}


export interface UserSignUpProps{
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress:string;
  password:string;
  boards: Array<any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UpdateLoggedInUsersPasswordProps{
  currentPassword:string;
  newPassword:string;
  confirmNewPassword:string;
}


export interface UserSignUpData{
  user:UserSignUpProps
}

export interface UserLogInData{
  message:string;
  user:UserSignUpProps
}

export interface SignUpModalProps{
  onSignUpSuccessful: (user:UserSignUpData) => void;
}

export interface LogInModalProps{
  onLogInSuccessful:(user:UserLogInData) => void
}


export interface ForgotPasswordProps{
  emailAddress:string;
}


export interface onForgotPasswordLinkSuccess{
  onLinkSuccess:(success:boolean) => void;
}


export interface ResetPasswordProps{
  token:string;
  newPassword:string;
}


export interface ResetUserPasswordFormProps{
  newPassword:string;
  confirmNewPassword:string;
}


export interface ConfirmationContainerProps{
  containerName:string;
}
