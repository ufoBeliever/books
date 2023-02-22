export interface IFilterProps {
  setFilter: React.Dispatch<
    React.SetStateAction<"" | "free-ebooks" | "paid-ebooks">
  >;
  value: "" | "free-ebooks" | "paid-ebooks";
  allValues: Array<"" | "free-ebooks" | "paid-ebooks">;
}
