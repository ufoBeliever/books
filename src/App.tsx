import React, { useEffect, useState } from "react";
import { BooksWrapper, Categories, Input, Sort } from "./components";
import { IBook } from "./models/types";
import { fetchAllElements, hasArrayIntersection } from "./utils/index.";
import { URL } from "./consts/index";

function App() {
  const [searchString, setSearchString] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Relevance");
  const [responseData, setResponseData] = useState<IBook[]>([]);
  const [allCategories, allSetCategories] = useState<Set<string> | null>(null);
  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<IBook[]>([]);

  useEffect(() => {
    if (searchString) {
      fetchAllElements(
        `${URL}?key=${
          process.env.REACT_APP_API_KEY
        }&q=${searchString}&orderBy=${sortBy.toLowerCase()}`,
        40
      ).then((e: IBook[]) => {
        const categories = [...e.map((e) => e.volumeInfo.categories)];
        let categoriesList: string[] = [];

        for (let el of categories) {
          categoriesList = [...categoriesList, ...(el ? el : [])];
        }
        allSetCategories(new Set(categoriesList));
        setResponseData(e);
      });
    }
  }, [searchString, sortBy]);

  useEffect(() => {
    let filteredData: IBook[] = [];
    if (currentCategories.length) {
      for (let el of responseData) {
        if (
          el.volumeInfo.categories &&
          hasArrayIntersection(el.volumeInfo.categories, currentCategories)
        ) {
          filteredData = [...filteredData, el];
        }
      }
      setFilteredData(filteredData);
    } else {
      setFilteredData(responseData);
    }
  }, [currentCategories, responseData]);

  return (
    <div className="App">
      <Input onSubmit={setSearchString} />
      <Sort value={sortBy} setValue={setSortBy} />
      {allCategories && (
        <Categories
          allCategories={allCategories}
          currentCategories={currentCategories}
          setCurrentCategories={setCurrentCategories}
        />
      )}
      <BooksWrapper responseData={filteredData} />
    </div>
  );
}

export default App;
