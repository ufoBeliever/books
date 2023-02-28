import { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { ICategoriesProps } from "./types";
import { TiTick } from "react-icons/ti";
import { conditionClassName, cutStr } from "../../utils/index.";
import { GrPowerReset } from "react-icons/gr";

export const Categories: React.FC<ICategoriesProps> = ({
  allCategories,
  currentCategories,
  setCurrentCategories,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const allCategoriesArr = Array.from(allCategories);

  const dropDown = useRef<HTMLDivElement | null>(null);

  const closeDropDown = (e: Event) => {
    if (!dropDown.current?.contains(e.target as Document)) {
      setIsOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropDown);

    return () => {
      document.removeEventListener("click", closeDropDown);
    };
  }, []);

  const setCategory = (category: string) => {
    if (currentCategories.indexOf(category) === -1) {
      setCurrentCategories((prev) => [...prev, category]);
    } else {
      setCurrentCategories((prev) => prev.filter((e) => e !== category));
    }
  };

  const isSelected = (category: string) =>
    currentCategories.indexOf(category) >= 0;

  return (
    <div className="categories-wrapper">
      <div className="categories" ref={dropDown}>
        <div
          className="categories__title"
          onClick={() => setIsOpened((prev) => !prev)}
        >
          <button className="categories__open-button">Set categories</button>
          <button
            className="categories__reset-button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentCategories([]);
            }}
          >
            <GrPowerReset />
          </button>
        </div>
        <div
          className={
            "categories__wrapper " +
            conditionClassName("categories__wrapper_opened", isOpened)
          }
        >
          {allCategories.size ? (
            allCategoriesArr
              .sort((a, b) => {
                if (a < b) {
                  return -1;
                }
                if (a > b) {
                  return 1;
                }
                return 0;
              })
              .map((e, i) => {
                const isItemSelected = isSelected(e);
                return (
                  <button
                    key={i}
                    onClick={() => setCategory(e)}
                    className={
                      "categories__item " +
                      conditionClassName(
                        "categories__item_selected",
                        isItemSelected
                      )
                    }
                  >
                    {cutStr(e, 17)}
                    {isItemSelected && <TiTick size="14px" color="#8E2912" />}
                  </button>
                );
              })
          ) : (
            <button className={"categories__item"}>
              No categories available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
