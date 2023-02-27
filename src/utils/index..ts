import { IBook } from "../models/types";

export const cutStr = (string: string, count: number) => {
  return string.length > count ? string.slice(0, count).trim() + "..." : string;
};

export const hasArrayIntersection = <T>(arr1: T[], arr2: T[]) => {
  for (let i of arr1) {
    for (let j of arr2) {
      if (i === j) {
        return true;
      }
    }
  }

  return false;
};

export const biggestPrice = (arr: IBook[]) => {
  let biggestPriceValue = 0;
  for (let el of arr) {
    const currentPrice = el.saleInfo.listPrice?.amount;
    if (biggestPriceValue < currentPrice) {
      biggestPriceValue = currentPrice;
    }
  }

  return biggestPriceValue;
};

export const conditionClassName = (
  className: string,
  condition: boolean
): string => {
  return condition ? className : "";
};
