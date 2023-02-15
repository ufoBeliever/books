import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../../consts";
import { Book } from "../Book";
import { IBooksWrapperProps } from "./types";
import "./styles.scss";
import { IResponse } from "../../models/types";

export const BooksWrapper: React.FC<IBooksWrapperProps> = ({
  searchString,
  sortBy,
}) => {
  const [responseData, setResponseData] = useState<null | IResponse>(null);
  console.log(responseData);

  useEffect(() => {
    if (searchString) {
      axios
        .get(
          `${URL}?key=${
            process.env.REACT_APP_API_KEY
          }&maxResults=24&q=${searchString}&orderBy=${sortBy.toLowerCase()}`
        )
        .then((e) => {
          setResponseData(e.data);
        });
    }
  }, [searchString, sortBy]);
  return responseData ? (
    <div className="books-wrapper">
      {responseData.items?.map((e, i) => {
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
