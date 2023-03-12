export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}
export interface IRect extends IPoint, ISize {}
