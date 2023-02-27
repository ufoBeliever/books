export interface ISortProps {
  value: "Relevance" | "Newest";
  setValue: React.Dispatch<React.SetStateAction<"Relevance" | "Newest">>;
}
