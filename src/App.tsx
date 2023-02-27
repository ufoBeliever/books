import React, { useEffect, useState } from "react";
import { BooksWrapper, Categories, Filter, Input, Sort } from "./components";
import { IBook } from "./models/types";
import { biggestPrice, hasArrayIntersection } from "./utils/index.";
import { URL } from "./consts/index";
import { Slider } from "antd";
import currencyFormatter from "currency-formatter";
import axios from "axios";

function App() {
  const [searchString, setSearchString] = useState<string>("");
  const [responseData, setResponseData] = useState<IBook[]>([]);
  const [availableCategories, setAvailableCategories] =
    useState<Set<string> | null>(null);
  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<IBook[]>([]);
  const [currentEBooksFilter, setCurrentEBooksFilter] = useState<
    "free-ebooks" | "paid-ebooks" | ""
  >("");
  const [sortBy, setSortBy] = useState<"Relevance" | "Newest">("Relevance");

  const [maxPrice, setMaxPrice] = useState<number>(0);

  const [minCurrentPrice, setMinCurrentPrice] = useState<number>(0);
  const [maxCurrentPrice, setMaxCurrentPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    if (searchString) {
      axios
        .get(
          `${URL}?key=${process.env.REACT_APP_API_KEY}&q=${searchString}&maxResults=40`
        )
        .then(({ data }) => {
          setResponseData(data.items);
        });
    }
  }, [searchString]);

  useEffect(() => {
    setCurrentCategories([]);
    setCurrentEBooksFilter("");
    setSortBy("Relevance");
    setMinCurrentPrice(0);

    for (let book of responseData) {
      if (
        book.saleInfo?.listPrice?.currencyCode !== currency &&
        book.saleInfo?.listPrice?.currencyCode
      ) {
        setCurrency(book.saleInfo.listPrice.currencyCode);
        break;
      }
    }

    let tempCategories: string[] = [];
    for (let book of responseData) {
      tempCategories = [
        ...tempCategories,
        ...(book.volumeInfo.categories ? book.volumeInfo.categories : []),
      ];
    }
    setAvailableCategories(new Set(tempCategories));

    const maxPrice = biggestPrice(responseData);
    setMaxPrice(maxPrice);
    setMaxCurrentPrice(maxPrice);
  }, [responseData]);

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
    switch (currentEBooksFilter) {
      case "free-ebooks":
        setMaxPrice(0);
        filteredData = filteredData.filter(
          (e) => e.saleInfo?.saleability === "FREE"
        );
        break;
      case "paid-ebooks":
        setMaxPrice(biggestPrice(responseData));
        filteredData = filteredData.filter(
          (e) => e.saleInfo?.listPrice?.amount > 0
        );
        break;
      default:
        setMaxPrice(biggestPrice(responseData));
    }
    if (sortBy === "Newest") {
      filteredData = [
        ...filteredData
          .filter((e) => e.volumeInfo.publishedDate)
          .sort((el1, el2) => {
            return (
              new Date(el2.volumeInfo.publishedDate).getTime() -
              new Date(el1.volumeInfo.publishedDate).getTime()
            );
          }),
        ...filteredData.filter((e) => !e.volumeInfo.publishedDate),
      ];
    }

    if (maxPrice) {
      if (!(maxPrice === maxCurrentPrice && minCurrentPrice === 0)) {
        filteredData = filteredData.filter((e) => {
          const elementPrice = e.saleInfo?.listPrice?.amount;
          return (
            elementPrice >= minCurrentPrice && elementPrice <= maxCurrentPrice
          );
        });
      }
    }
    setFilteredData(filteredData);
  }, [
    currentCategories,
    responseData,
    currentEBooksFilter,
    sortBy,
    minCurrentPrice,
    maxCurrentPrice,
    maxPrice,
  ]);

  return (
    <div className="App">
      <Input onSubmit={setSearchString} />
      {availableCategories && (
        <>
          <Categories
            allCategories={availableCategories}
            currentCategories={currentCategories}
            setCurrentCategories={setCurrentCategories}
          />
          <Sort value={sortBy} setValue={setSortBy} />
        </>
      )}
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
      <BooksWrapper data={filteredData} />
    </div>
  );
}

export default App;
