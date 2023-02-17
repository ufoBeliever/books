import "./styles.scss";
import { ISliderProps } from "./types";

export const Slider: React.FC<ISliderProps> = ({
  value,
  setValue,
  range,
  title,
}) => {
  return (
    <div>
      <div>{title}</div>
      <input
        type="range"
        min={range[0]}
        max={Math.ceil(range[1])}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
      />
      <div>{value}</div>
    </div>
  );
};
