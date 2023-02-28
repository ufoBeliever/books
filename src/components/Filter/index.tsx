import React from "react";
import { IFilterProps } from "./types";
import "./styles.scss";
import { conditionClassName } from "../../utils/index.";

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
            className={
              "filter__button " +
              conditionClassName("filter__button_checked", e === value)
            }
          >
            {e ? e : " all"}
          </button>
        );
      })}
    </div>
  );
};
