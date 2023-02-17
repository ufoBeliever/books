export interface ISliderProps {
  range: number[];
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  title: string;
}
