import axios from "axios";

export const fetchAllElements = async (url: string, limit: number) => {
  url += `&maxResults=${limit}`;

  const { data } = await axios.get(url);
  return data.items;
};

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
