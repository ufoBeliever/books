import axios from "axios";

export const fetchAllElements = async (url: string, limit: number) => {
  url += `&maxResults=${limit}`;

  const { data } = await axios.get(url);
  return data.items;
};
