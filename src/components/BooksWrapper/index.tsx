import { Book } from "../Book";
import { IBooksWrapperProps } from "./types";
import "./styles.scss";

export const BooksWrapper: React.FC<IBooksWrapperProps> = ({ data }) => {
  return data.length ? (
    <div className="books-wrapper">
      {data.map((e, i) => {
        const { saleInfo, volumeInfo, id } = e;
        const { publishedDate, previewLink, title, authors, imageLinks } =
          volumeInfo;
        return (
          <Book
            currency={saleInfo?.listPrice?.currencyCode}
            publishDate={publishedDate}
            price={saleInfo?.listPrice?.amount}
            key={id + i}
            link={previewLink}
            title={title}
            author={authors?.join(", ")}
            image={imageLinks?.thumbnail}
          />
        );
      })}
    </div>
  ) : null;
};
