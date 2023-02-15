import { IBookProps } from "./types";
import "./styles.scss";

export const Book: React.FC<IBookProps> = ({ title, author, image }) => {
  const cutStr = (string: string, count: number) => {
    return string.length > count
      ? string.trim().slice(0, count) + "..."
      : string;
  };

  return (
    <div className="book">
      <img src={image} alt="Book cover" className="book__image" />
      <div className="book__text-wrapper">
        <h4 className="book__title">{cutStr(title, 15)}</h4>
        <span className="book__author">{cutStr(author, 15)}</span>
      </div>
    </div>
  );
};
