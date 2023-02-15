import { IBookProps } from "./types";
import "./styles.scss";

export const Book: React.FC<IBookProps> = ({
  title = "Unknown title",
  author = "Unknown author",
  image = "",
  link = "",
}) => {
  const cutStr = (string: string, count: number) => {
    return string.length > count
      ? string.slice(0, count).trim() + "..."
      : string;
  };

  return (
    <a href={link}>
      <div className="book">
        <img src={image} alt="Book cover" className="book__image" />
        <div className="book__text-wrapper">
          <h4 className="book__title" title={title}>
            {cutStr(title, 8)}
          </h4>
          <span className="book__author" title={author}>
            {cutStr(author, 10)}
          </span>
        </div>
      </div>
    </a>
  );
};
