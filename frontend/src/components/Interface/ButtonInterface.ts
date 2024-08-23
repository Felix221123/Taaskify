export interface ButtonProps {
  buttonName: string;
  onClickProp?: () => void;
  btnType?: 'reset' | 'submit' | 'button'
}
