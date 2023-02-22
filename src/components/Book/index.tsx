import { IBookProps } from "./types";
import "./styles.scss";
import { cutStr } from "../../utils/index.";
import currencyFormatter from "currency-formatter";

export const Book: React.FC<IBookProps> = ({
  title = "Unknown title",
  author = "Unknown author",
  image = "",
  link = "",
  publishDate = "",
  price = null,
  currency = "",
}) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="book">
        <img src={image} alt="Book cover" className="book__image" />
        <div className="book__text-wrapper">
          <h4 className="book__title">{cutStr(title, 20)}</h4>
          <span className="book__author">{cutStr(author, 20)}</span>

          <span>{publishDate}</span>
          {price ? (
            <span>{currencyFormatter.format(price, { code: currency })}</span>
          ) : null}
        </div>
      </div>
    </a>
  );
};
