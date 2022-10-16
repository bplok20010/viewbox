import { Matrix2D } from "matrix2d.js";

import { IPoint, IRect } from "../src/types";

export interface IViewBoxOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

/**
 * viewBox类
 */
export class ViewBox {
  protected options: IViewBoxOptions;
  protected matrix = new Matrix2D();

  width = DEFAULT_WIDTH;
  height = DEFAULT_HEIGHT;

  /**
   * 当前缩放值
   */
  protected _zoom = 1;

  constructor(options: IViewBoxOptions = {}) {
    this.options = options;
    this.width = options.width ?? DEFAULT_WIDTH;
    this.height = options.height ?? DEFAULT_HEIGHT;

    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
  }

  get x() {
    return this.matrix.tx;
  }

  set x(value: number) {
    this.translateX(value);
  }

  get y() {
    return this.matrix.ty;
  }

  set y(value: number) {
    this.translateY(value);
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(value: number) {
    this.setZoom(value);
  }

  getMatrix() {
    return this.matrix.clone();
  }

  getPosition() {
    return {
      x: this.matrix.tx,
      y: this.matrix.ty,
    };
  }

  /**
   * 相对viewBox左上角的坐标转换为viewBox的实际坐标
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.toLocal(0, 0) // {x: -100, y: -100}
   */
  toLocal(x: number, y: number) {
    return this.matrix.clone().invert().transformPoint(x, y);
  }

  toGlobal(x: number, y: number) {
    return this.matrix.transformPoint(x, y);
  }

  translate(x: number, y: number) {
    this.matrix.translate(x, y);
  }

  translateX(x: number) {
    this.matrix.translateX(x);
  }

  translateY(y: number) {
    this.matrix.translateY(y);
  }

  /**
   * 获取当前缩放值
   * @returns
   */
  getZoom() {
    return this._zoom;
  }

  /**
   * alias getZoom
   * @returns
   */
  getScale() {
    return this.getZoom();
  }

  /**
   * 视图缩放
   * @param value 缩放值
   * @param zoomPoint 缩放坐标。默认为当前视图中心点
   */
  setZoom(value: number, zoomPoint?: IPoint) {
    this._zoom = value;

    zoomPoint = zoomPoint || {
      x: this.width / 2,
      y: this.height / 2,
    };

    const localZoomPoint = this.toLocal(zoomPoint.x, zoomPoint.y);

    const mtx = new Matrix2D();
    // 先平移到原坐标
    mtx.translate(this.matrix.tx, this.matrix.ty);
    // 进行缩放
    mtx.scale(value, value);

    const globalZoomPoint = mtx.transformPoint(localZoomPoint.x, localZoomPoint.y);

    const tx = zoomPoint.x - globalZoomPoint.x;
    const ty = zoomPoint.y - globalZoomPoint.y;
    // 对缩放点偏移量平移
    mtx.translate(tx, ty);

    this.matrix = mtx;
  }

  /**
   * alias setZoom
   */
  setScale(value: number, zoomPoint?: IPoint) {
    this.setZoom(value, zoomPoint);
  }

  /**
   * 自动对指定区域进行缩放，并将区域中心移动到视图中心
   * @param rect
   */
  zoomToRect(rect: IRect, options: { scale?: number; padding?: number } = {}) {
    const padding = options.padding ?? 40;

    const vWidth = this.width - padding * 2;
    const vHeight = this.height - padding * 2;

    const scale = options.scale ?? Math.min(vWidth / rect.width, vHeight / rect.height);

    const cx = this.width / 2;
    const cy = this.height / 2;

    const rectCx = rect.x + rect.width / 2;
    const rectCy = rect.y + rect.height / 2;

    const tx = cx - rectCx;
    const ty = cy - rectCy;

    this._zoom = scale;

    const mtx = new Matrix2D();

    mtx.translate(tx, ty);

    const sx = cx - mtx.tx;
    const sy = cy - mtx.ty;

    mtx.scale(scale, scale, sx, sy);

    this.matrix = mtx;
  }

  /**
   * alias zoomToRect
   */
  scaleToRect(rect: IRect, options: { scale?: number; padding?: number } = {}) {
    this.zoomToRect(rect, options);
  }
}
