import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../../consts";
import { Book } from "../Book";
import { IBooksWrapperProps } from "./types";
import "./styles.scss";
import { IResponse } from "../../models/types";

export const BooksWrapper: React.FC<IBooksWrapperProps> = ({
  searchString,
}) => {
  const [responseData, setResponseData] = useState<null | IResponse>(null);
  console.log(responseData);

  useEffect(() => {
    axios
      .get(
        `${URL}?key=${process.env.REACT_APP_API_KEY}&maxResults=24` +
          (searchString ? `&q=${searchString}` : "&q=btgrrrrfrgrrege5")
      )
      .then((e) => {
        setResponseData(e.data);
      });
  }, [searchString]);
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
