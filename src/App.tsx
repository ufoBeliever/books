import React, { useEffect, useRef, useState } from "react";
import { BooksWrapper, Categories, Filter, Input, Sort } from "./components";
import { IBook } from "./models/types";
import {
  biggestPrice,
  conditionClassName,
  hasArrayIntersection,
} from "./utils/index.";
import { URL } from "./consts/index";
import { Slider } from "antd";
import currencyFormatter from "currency-formatter";
import axios from "axios";
import ReactLoading from "react-loading";

interface IResponseData {
  data: IBook[] | null;
  error: boolean;
  loading: boolean;
}

function App() {
  const [searchString, setSearchString] = useState<string>("");
  const [{ data, error, loading }, setResponseData] = useState<IResponseData>({
    data: null,
    loading: false,
    error: false,
  });
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
  const [areFiltersOpened, setAreFiltersOpened] = useState<boolean>(false);

  const filters = useRef<HTMLDivElement | null>(null);

  const closeFilters = (e: Event) => {
    if (!filters.current?.contains(e.target as Document)) {
      setAreFiltersOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeFilters);

    return () => {
      document.removeEventListener("click", closeFilters);
    };
  }, []);

  useEffect(() => {
    if (searchString) {
      setResponseData({
        data: null,
        loading: true,
        error: false,
      });
      axios
        .get(
          `${URL}?key=${process.env.REACT_APP_API_KEY}&q=${searchString}&maxResults=40`
        )
        .then(({ data }) => {
          setResponseData({
            data: data.items,
            loading: false,
            error: false,
          });
        })
        .catch(() => {
          setResponseData({
            data: null,
            loading: false,
            error: true,
          });
        });
    }
  }, [searchString]);

  const filtersClickHandler = () => {
    if (data) {
      setAreFiltersOpened((prev) => !prev);
    }
  };

  useEffect(() => {
    setCurrentCategories([]);
    setCurrentEBooksFilter("");
    setSortBy("Relevance");
    setMinCurrentPrice(0);

    if (data) {
      for (let book of data) {
        if (
          book.saleInfo?.listPrice?.currencyCode !== currency &&
          book.saleInfo?.listPrice?.currencyCode
        ) {
          setCurrency(book.saleInfo.listPrice.currencyCode);
          break;
        }
      }

      let tempCategories: string[] = [];
      for (let book of data) {
        tempCategories = [
          ...tempCategories,
          ...(book.volumeInfo.categories ? book.volumeInfo.categories : []),
        ];
      }
      setAvailableCategories(new Set(tempCategories));

      const maxPrice = biggestPrice(data);
      setMaxPrice(maxPrice);
      setMaxCurrentPrice(maxPrice);
    }
  }, [data, currency]);

  useEffect(() => {
    if (data) {
      let filteredData: IBook[] = [];

      if (currentCategories.length) {
        for (let el of data) {
          if (
            el.volumeInfo.categories &&
            hasArrayIntersection(el.volumeInfo.categories, currentCategories)
          ) {
            filteredData = [...filteredData, el];
          }
        }
      } else {
        filteredData = data;
      }
      switch (currentEBooksFilter) {
        case "free-ebooks":
          setMaxPrice(0);
          filteredData = filteredData.filter(
            (e) => e.saleInfo?.saleability === "FREE"
          );
          break;
        case "paid-ebooks":
          setMaxPrice(biggestPrice(data));
          filteredData = filteredData.filter(
            (e) => e.saleInfo?.listPrice?.amount > 0
          );
          break;
        default:
          setMaxPrice(biggestPrice(data));
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
            const isFree = e.saleInfo?.saleability === "FREE";
            return (
              (isFree && minCurrentPrice === 0) ||
              (elementPrice >= minCurrentPrice &&
                elementPrice <= maxCurrentPrice)
            );
          });
        }
      }
      setFilteredData(filteredData);
    }
  }, [
    currentCategories,
    data,
    currentEBooksFilter,
    sortBy,
    minCurrentPrice,
    maxCurrentPrice,
    maxPrice,
  ]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="content-center">
          <span className="notification">Error</span>
        </div>
      );
    }
    if (loading) {
      return (
        <div className="content-center">
          <ReactLoading type="balls" color="black" height={50} width={50} />
        </div>
      );
    }

    return filteredData.length ? (
      <BooksWrapper data={filteredData} />
    ) : (
      <div className="content-center">
        <span className="notification">No items found</span>
      </div>
    );
  };

  return (
    <div className="app">
      <div ref={filters}>
        <header className="header">
          <button
            className="header__button"
            onClick={filtersClickHandler}
            disabled={!data}
          >
            {areFiltersOpened ? (
              <img
                alt=""
                src={require("../src/assets/close.png")}
                className="header__button-image"
              />
            ) : (
              <img
                alt=""
                src={require("../src/assets/filters.png")}
                className="header__button-image"
              />
            )}
          </button>
          <Input onSubmit={setSearchString} />
        </header>
        <div
          className={
            "filters " + conditionClassName("filters__opened", areFiltersOpened)
          }
        >
          <div className="filters__small">
            {!!availableCategories?.size && (
              <>
                <Categories
                  allCategories={availableCategories}
                  currentCategories={currentCategories}
                  setCurrentCategories={setCurrentCategories}
                />
                <Sort value={sortBy} setValue={setSortBy} />
              </>
            )}
            {!!data && (
              <Filter
                allValues={["free-ebooks", "paid-ebooks", ""]}
                value={currentEBooksFilter}
                setFilter={setCurrentEBooksFilter}
              />
            )}
          </div>
          {!!maxPrice && (
            <div className="filters__price">
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
              <div className="filters__prices-data">
                <span>
                  {currencyFormatter.format(minCurrentPrice, {
                    code: currency,
                  })}
                </span>
                <span>
                  {currencyFormatter.format(maxCurrentPrice, {
                    code: currency,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

export default App;
