import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../../consts";
import { Book } from "../Book";
import { IBooksWrapperProps } from "./types";

export const BooksWrapper: React.FC<IBooksWrapperProps> = ({
  searchString,
}) => {
  const [responseData, setResponseData] = useState<any>(null);
  console.log(responseData);

  useEffect(() => {
    axios
      .get(`${URL}?key=${process.env.REACT_APP_API_KEY}&q=${searchString}`)
      .then((e) => {
        setResponseData(e.data);
      });
  }, [searchString]);
  return responseData ? (
    <div>
      {responseData.items?.map((e: any) => {
        return (
          <Book
            title={e.volumeInfo.title}
            author={e.volumeInfo.authors ? e.volumeInfo.authors.join(", ") : ""}
            image={e.volumeInfo.imageLinks.thumbnail}
          />
        );
      })}
    </div>
  ) : null;
};
