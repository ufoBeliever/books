import { Book } from "../Book";
import { IBooksWrapperProps } from "./types";
import "./styles.scss";

export const BooksWrapper: React.FC<IBooksWrapperProps> = ({
  responseData,
}) => {
  return responseData.length ? (
    <div className="books-wrapper">
      {responseData.map((e, i) => {
        return (
          <Book
            key={e.id + i}
            link={e.volumeInfo.previewLink}
            title={e.volumeInfo.title}
            author={e.volumeInfo.authors?.join(", ")}
            image={e.volumeInfo.imageLinks?.thumbnail}
          />
        );
      })}
    </div>
  ) : null;
};
