import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../../consts";
import { Book } from "../Book";
import { IBooksWrapperProps } from "./types";
import "./styles.scss";
import { IBook } from "../../models/types";
import { fetchAllElements } from "../../utils/index.";

export const BooksWrapper: React.FC<IBooksWrapperProps> = ({
  searchString,
  sortBy,
}) => {
  const [responseData, setResponseData] = useState<IBook[]>([]);

  useEffect(() => {
    if (searchString) {
      fetchAllElements(
        `${URL}?key=${
          process.env.REACT_APP_API_KEY
        }&q=${searchString}&orderBy=${sortBy.toLowerCase()}`,
        40
      ).then((e) => {
        console.log(e);
        setResponseData(e);
      });
    }
  }, [searchString, sortBy]);
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
