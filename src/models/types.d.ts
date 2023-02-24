export interface IIndustryId {
  type: string;
  identifier: string;
}

export interface IVolumeInfo {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: IIndustryId[];
  readingModels: {
    text: true;
    image: true;
  };

  pageCount: number;
  printType: string;
  categories: string[];
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: object;
  imageLinks: { smallThumbnail: string; thumbnail: string };
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

export interface IListPrice {
  amount: number;
  currencyCode: string;
}

export interface IBook {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: IVolumeInfo;
  saleInfo: {
    listPrice: IListPrice;
    saleability: string;
  };
  accessInfo: object;
  searchInfo: object;
}

export interface IResponse {
  kind: string;
  totalItems: number;
  items: IBook[];
}
