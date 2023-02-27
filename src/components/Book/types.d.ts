export interface IBookProps {
  title: string;
  author: string;
  image: string;
  link: string;
  publishDate: string;
  price?: number | null;
  currency?: string;
  isFree?: boolean;
}
