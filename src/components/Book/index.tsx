import { IBookProps } from "./types";
import { cutStr } from "../../utils/index.";
import currencyFormatter from "currency-formatter";
import "./styles.scss";

export const Book: React.FC<IBookProps> = ({
  title = "Unknown title",
  author = "Unknown author",
  image = "",
  link = "",
  publishDate = "",
  price = null,
  currency = "",
  isFree,
}) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="book">
        <main className="book__main">
          <img src={image} alt="Book cover" className="book__image" />
          <div className="book__text-wrapper">
            <h4 className="book__title">
              {cutStr(title, 20)} (
              {new Date(publishDate).toLocaleDateString("ru-RU")})
            </h4>
            <span className="book__author">{cutStr(author, 20)}</span>

            <span className="book__price">
              {isFree
                ? "FREE"
                : price
                ? currencyFormatter.format(price, { code: currency })
                : "Not for sale"}
            </span>
          </div>
        </main>
      </div>
    </a>
  );
};
