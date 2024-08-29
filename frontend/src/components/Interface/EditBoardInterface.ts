export interface EditProps {
  name: string | undefined;
  boardID: string;
  columns?: Array<{ name: string; tasks: [] }>;
  onCloseProp:() => void;
}
