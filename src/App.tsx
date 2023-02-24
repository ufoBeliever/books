import React, { useEffect, useState } from "react";
import { BooksWrapper, Categories, Filter, Input, Sort } from "./components";
import { IBook } from "./models/types";
import {
  biggestPrice,
  fetchAllElements,
  hasArrayIntersection,
} from "./utils/index.";
import { URL } from "./consts/index";
import { Slider } from "antd";
import currencyFormatter from "currency-formatter";

function App() {
  const [searchString, setSearchString] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Relevance");
  const [responseData, setResponseData] = useState<IBook[]>([]);
  const [allCategories, setALLCategories] = useState<Set<string> | null>(null);
  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<IBook[]>([]);

  const [minCurrentPrice, setMinCurrentPrice] = useState<number>(0);
  const [maxCurrentPrice, setMaxCurrentPrice] = useState<number>(Infinity);

  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("");
  const [currentEBooksFilter, setCurrentEBooksFilter] = useState<
    "free-ebooks" | "paid-ebooks" | ""
  >("");

  useEffect(() => {
    if (searchString) {
      fetchAllElements(
        `${URL}?key=${
          process.env.REACT_APP_API_KEY
        }&q=${searchString}&orderBy=${sortBy.toLowerCase()}${
          currentEBooksFilter ? `&filter=${currentEBooksFilter}` : ""
        }`,
        40
      ).then((e: IBook[]) => {
        const categories = [
          ...e.map((e) => e.volumeInfo.categories).filter((e) => e),
        ];
        let categoriesList: string[] = [];

        for (let el of categories) {
          categoriesList = [...categoriesList, ...(el ? el : [])];
        }
        setALLCategories(new Set([...categoriesList, ...currentCategories]));
        setResponseData(e);
      });
    }
  }, [searchString, sortBy, currentEBooksFilter, currentCategories]);

  useEffect(() => {
    for (let book of responseData) {
      if (
        book.saleInfo?.listPrice?.currencyCode !== currency &&
        book.saleInfo?.listPrice?.currencyCode
      ) {
        setCurrency(book.saleInfo.listPrice.currencyCode);
        break;
      }
    }
  }, [responseData, currency]);

  useEffect(() => {
    if (maxPrice && maxCurrentPrice > maxPrice) {
      setMaxCurrentPrice(maxPrice);
    }
  }, [maxCurrentPrice, maxPrice]);

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
    } else {
      filteredData = responseData;
    }
    setMaxPrice(biggestPrice(filteredData));
    if (minCurrentPrice === 0 && maxCurrentPrice === maxPrice) {
      setFilteredData(filteredData);
    } else {
      setFilteredData(
        filteredData.filter((e) => {
          return (
            e.saleInfo.listPrice?.amount <= maxCurrentPrice &&
            e.saleInfo.listPrice?.amount >= minCurrentPrice
          );
        })
      );
    }
  }, [
    currentCategories,
    responseData,
    maxCurrentPrice,
    minCurrentPrice,
    allCategories,
    maxPrice,
  ]);

  return (
    <div className="App">
      <Input onSubmit={setSearchString} />

      <Filter
        allValues={["free-ebooks", "paid-ebooks", ""]}
        value={currentEBooksFilter}
        setFilter={setCurrentEBooksFilter}
      />
      {!!maxPrice && (
        <>
          <Slider
            range
            value={[minCurrentPrice, maxCurrentPrice]}
            defaultValue={[0, maxPrice]}
            max={maxPrice}
            min={0}
            onChange={(a: [number, number]) => {
              setMinCurrentPrice(a[0]);
              setMaxCurrentPrice(a[1]);
            }}
          />
          {currencyFormatter.format(minCurrentPrice, { code: currency })},
          {currencyFormatter.format(maxCurrentPrice, { code: currency })}
        </>
      )}
      {allCategories && (
        <>
          <Categories
            allCategories={allCategories}
            currentCategories={currentCategories}
            setCurrentCategories={setCurrentCategories}
          />
          <Sort value={sortBy} setValue={setSortBy} />
        </>
      )}
      <BooksWrapper responseData={filteredData} />
    </div>
  );
}

export default App;
