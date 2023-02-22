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
  const [currentPrice, setCurrentPrice] = useState<[number, number]>([0, 0]);
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
        for (let book of e) {
          if (
            book.saleInfo?.listPrice?.currencyCode !== currency &&
            book.saleInfo?.listPrice?.currencyCode
          ) {
            console.log(currency, book.saleInfo.listPrice.currencyCode);
            setCurrency(book.saleInfo.listPrice.currencyCode);
            break;
          }
        }
        const categories = [...e.map((e) => e.volumeInfo.categories)];
        let categoriesList: string[] = [];

        for (let el of categories) {
          categoriesList = [...categoriesList, ...(el ? el : [])];
        }
        setALLCategories(new Set(categoriesList));
        setResponseData(e);
      });
    }
  }, [searchString, sortBy, currency, currentEBooksFilter]);

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
    if (currentPrice[0] === 0 && currentPrice[1] === maxPrice) {
      setFilteredData(filteredData);
    } else {
      setFilteredData(
        filteredData.filter((e) => {
          return (
            e.saleInfo.listPrice?.amount <= currentPrice[1] &&
            e.saleInfo.listPrice?.amount >= currentPrice[0]
          );
        })
      );
    }
  }, [currentCategories, responseData, currentPrice, allCategories, maxPrice]);

  useEffect(() => {
    setCurrentCategories([]);
    setFilteredData([]);
    setCurrentPrice([0, maxPrice]);
  }, [responseData, maxPrice]);

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
            value={currentPrice}
            defaultValue={[0, maxPrice]}
            max={maxPrice}
            min={0}
            onChange={(a: any) => {
              setCurrentPrice(a);
            }}
          />
          {currencyFormatter.format(currentPrice[0], { code: currency })},
          {currencyFormatter.format(currentPrice[1], { code: currency })}
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
