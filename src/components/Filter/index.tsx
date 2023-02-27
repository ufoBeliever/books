import React from "react";
import { IFilterProps } from "./types";
import "./styles.scss";

export const Filter: React.FC<IFilterProps> = ({
  setFilter,
  allValues,
  value,
}) => {
  return (
    <div className="filter">
      {allValues.map((e, i) => {
        return (
          <button
            key={i}
            onClick={() => setFilter(e)}
            className={[
              "filter__button",
              e === value ? "filter__button_checked" : null,
            ]
              .filter((e) => e)
              .join(" ")}
          >
            {e ? e : " none"}
          </button>
        );
      })}
    </div>
  );
};
