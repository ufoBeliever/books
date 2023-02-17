export interface ICategoriesProps {
  allCategories: Set<string>;
  currentCategories: string[];
  setCurrentCategories: React.Dispatch<React.SetStateAction<string[]>>;
}
