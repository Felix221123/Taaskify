export interface ProfileProps{
  firstName:string,
  lastName:string,
  onClickProps:() => void;
}

export interface EditProfileProps{
  firstName:string;
  lastName:string;
  emailAddress:string;
}
