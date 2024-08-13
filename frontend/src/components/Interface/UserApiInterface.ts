
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
  token:string;
  user:UserSignUpData
}

export interface SignUpModalProps{
  onSignUpSuccessful: (user:UserSignUpData) => void;
}

export interface LogInModalProps{
  onLogInSuccessful:(user:UserLogInData) => void
}
