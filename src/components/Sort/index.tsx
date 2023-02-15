import { ISortProps } from "./types";
import "./styles.scss";

export const Sort: React.FC<ISortProps> = ({ value, setValue }) => {
  return (
    <div className="sort">
      <span className="sort__title">Sort by</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="sort__select"
      >
        <option>Newest</option>
        <option>Relevance</option>
      </select>
    </div>
  );
};
