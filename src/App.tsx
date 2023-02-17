import React, { useEffect, useState } from "react";
import { BooksWrapper, Categories, Input, Sort } from "./components";
import { IBook } from "./models/types";
import {
  biggestPrice,
  fetchAllElements,
  hasArrayIntersection,
} from "./utils/index.";
import { URL } from "./consts/index";
import { Slider } from "./components/Slider";

function App() {
  const [searchString, setSearchString] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Relevance");
  const [responseData, setResponseData] = useState<IBook[]>([]);
  const [allCategories, setALLCategories] = useState<Set<string> | null>(null);
  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<IBook[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

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
        setALLCategories(new Set(categoriesList));
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
      setFilteredData(
        filteredData.filter((e) => {
          return (e.saleInfo.listPrice?.amount || 0) <= currentPrice;
        })
      );
      setMaxPrice(biggestPrice(filteredData));
    } else {
      setFilteredData(
        responseData.filter((e) => {
          return (e.saleInfo.listPrice?.amount || 0) <= currentPrice;
        })
      );
      setMaxPrice(biggestPrice(responseData));
    }
  }, [currentCategories, responseData, currentPrice]);

  useEffect(() => {
    setCurrentCategories([]);
    setFilteredData([]);
    setCurrentPrice(0);
    setMaxPrice(0);
  }, [responseData]);

  return (
    <div className="App">
      <Input onSubmit={setSearchString} />
      <Sort value={sortBy} setValue={setSortBy} />
      {!!maxPrice && (
        <Slider
          title="Price"
          value={currentPrice}
          setValue={setCurrentPrice}
          range={[0, maxPrice]}
        />
      )}
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
