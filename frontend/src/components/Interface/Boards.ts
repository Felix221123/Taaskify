

export interface Board {
  boards: BoardProps[];
}

export interface BoardProps {
  name: string;
  columns?: DataColumnProp[];
  _id:string
}


interface DataColumnProp{
  _id:string;
  name:string;
  tasks:any
}

export interface NavbarProps {
  boards: BoardProps[];
  user:UserNavbarProps
}



export interface UserNavbarProps{
  firstName: string;
  lastName: string;
  emailAddress: string;
}


export interface OnContainerCloseProp{
  onCloseContainer:() => void;
}
