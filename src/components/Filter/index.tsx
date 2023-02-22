import React from "react";
import { IFilterProps } from "./types";

export const Filter: React.FC<IFilterProps> = ({
  setFilter,
  value,
  allValues,
}) => {
  console.log(value);
  return (
    <div>
      {allValues.map((e, i) => {
        return (
          <button key={i} onClick={() => setFilter(e)}>
            {e ? e : " none"}
          </button>
        );
      })}
    </div>
  );
};
