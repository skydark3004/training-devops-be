interface IWithColumns<T> {
  columns: (keyof T)[];
  type: 'SELECT' | 'EXCEPT';
}

interface IWithoutColumns {
  columns?: undefined;
  type?: undefined;
}

export type GetSelectColumnsParams<T> = IWithColumns<T> | IWithoutColumns;

export interface IPagination {
  page: number;
  pageSize: number;
}

export type TypeResponsePagination<T> = {
  data: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPage: number;
};
