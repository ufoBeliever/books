import { useState } from "react";
import "./styles.scss";
import { ICategoriesProps } from "./types";
import { TiTick } from "react-icons/ti";
import { cutStr } from "../../utils/index.";

export const Categories: React.FC<ICategoriesProps> = ({
  allCategories,
  currentCategories,
  setCurrentCategories,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const allCategoriesArr = Array.from(allCategories);

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
    <div className="categories">
      <div
        className="categories__title"
        onClick={() => setIsOpened((prev) => !prev)}
      >
        <span>Set categories</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentCategories([]);
          }}
        >
          Reset
        </button>
      </div>
      <div
        className={
          "categories__wrapper " +
          (isOpened ? "categories__wrapper_opened" : "")
        }
      >
        {allCategoriesArr
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
                title={e}
                onClick={() => setCategory(e)}
                className={
                  "categories__item " +
                  (isItemSelected ? "categories__item_selected" : "")
                }
              >
                {cutStr(e, 17)}
                {isItemSelected && <TiTick size="14px" color="#8E2912" />}
              </button>
            );
          })}
      </div>
    </div>
  );
};
