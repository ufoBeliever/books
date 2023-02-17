import { IBookProps } from "./types";
import "./styles.scss";
import { cutStr } from "../../utils/index.";

export const Book: React.FC<IBookProps> = ({
  title = "Unknown title",
  author = "Unknown author",
  image = "",
  link = "",
}) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="book">
        <img src={image} alt="Book cover" className="book__image" />
        <div className="book__text-wrapper">
          <h4 className="book__title" title={title}>
            {cutStr(title, 15)}
          </h4>
          <span className="book__author" title={author}>
            {cutStr(author, 11)}
          </span>
        </div>
      </div>
    </a>
  );
};
