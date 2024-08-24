import { ColumnProps } from './Column';

export interface Board {
  boards: BoardProps[];
}

export interface BoardProps {
  name?: string;
  columns?: ColumnProps[];
}

export interface NavbarProps {
  boards: BoardProps[];
  onBoardChange: (index: number) => void;
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
