export const PageSizeOptions = [
  10, 50, 100
];

export interface ReqPageInfo {
  page: number;
  size: number;
}

export interface ResPageInfo {
  page: number;
  size: number;
  start: number;
  end: number;
  total: number;
}

export type MenuInfo = {
  title: string,
  itemId: string,
  pathname?: string,
  subNav?: MenuInfo[]
};
