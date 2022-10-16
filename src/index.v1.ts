import { Matrix2D } from "matrix2d.js";

import type { IPoint, IRect } from "./types";

export interface IViewBoxOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

function isUndefined(value: any) {
  return typeof value === "undefined";
}

/**
 * ViewBox
 */
export class ViewBox {
  protected options: IViewBoxOptions;
  protected matrix = new Matrix2D();
  protected transformOrigin: IPoint;
  protected translateMatrix = new Matrix2D();
  protected rotationMatrix = new Matrix2D();
  protected scaleMatrix = new Matrix2D();
  protected flipMatrix = new Matrix2D();

  width = DEFAULT_WIDTH;
  height = DEFAULT_HEIGHT;

  constructor(options: IViewBoxOptions = {}) {
    this.options = options;
    this.width = options.width ?? DEFAULT_WIDTH;
    this.height = options.height ?? DEFAULT_HEIGHT;

    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
  }

  protected decompose() {
    return this.matrix.decompose();
  }

  protected get cx() {
    return this.transformOrigin ? this.transformOrigin.x : this.width / 2;
  }

  protected get cy() {
    return this.transformOrigin ? this.transformOrigin.y : this.height / 2;
  }

  setTransformOrigin(x: number, y: number) {
    this.transformOrigin = {
      x,
      y,
    };
  }

  getTransformOrigin() {
    return {
      x: this.cx,
      y: this.cy,
    };
  }

  get x() {
    return this.matrix.tx;
  }

  set x(value: number) {
    const delta = value - this.x;
    this.translate(delta, 0);
  }

  get y() {
    return this.matrix.ty;
  }

  set y(value: number) {
    const delta = value - this.y;
    this.translate(0, delta);
  }

  get zoom() {
    return this.decompose().scaleX;
  }

  /**
   * scale based on center point
   */
  set zoom(value: number) {
    this.setZoom(value);
  }

  getMatrix() {
    return this.matrix.clone();
  }

  /**
   * 相对viewBox左上角的坐标转换为viewBox的实际坐标
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.globalToLocal(0, 0) // {x: -100, y: -100}
   */
  globalToLocal(x: number, y: number) {
    return this.getMatrix().invert().transformPoint(x, y);
  }

  /**
   * 相对viewBox左上角的坐标转换为viewBox的实际坐标
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.globalToLocal(0, 0) // {x: -100, y: -100}
   */
  localToGlobal(x: number, y: number) {
    return this.matrix.transformPoint(x, y);
  }

  translate(x: number, y: number) {
    const r1 = this.globalToLocal(0, 0);
    const r2 = this.globalToLocal(x, y);

    this.matrix.translate(r2.x - r1.x, r2.y - r1.y);

    return this;
  }

  translateX(x: number) {
    return this.translate(x, 0);
  }

  translateY(y: number) {
    return this.translate(0, y);
  }

  /**
   * 获取当前缩放值
   * @returns
   */
  getZoom() {
    return this.zoom;
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
  setZoom(value: number): ViewBox;
  setZoom(value: number, cx: number, cy: number): ViewBox;
  setZoom(value: number, cx?: number, cy?: number) {
    let { scaleX, scaleY } = this.matrix.decompose();

    scaleX = value / scaleX;
    scaleY = value / scaleY;

    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.scale(scaleX, scaleY, local.x, local.y);

    return this;
  }

  /**
   * alias setZoom
   */
  get setScale() {
    return this.setZoom;
  }

  getRotation() {
    return this.decompose().rotation;
  }

  setRotation(rotation: number): ViewBox;
  setRotation(rotation: number, cx: number, cy: number): ViewBox;
  setRotation(rotation: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    const c = this.decompose();

    this.matrix.rotate(rotation - c.rotation, local.x, local.y);

    return this;
  }

  flipX(): ViewBox;
  flipX(cx: number, cy: number): ViewBox;
  flipX(cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.flipMatrix.scale(-1, 1, local.x, local.y);

    return this;
  }

  flipY(): ViewBox;
  flipY(cx: number, cy: number): ViewBox;
  flipY(cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.flipMatrix.scale(1, -1, local.x, local.y);

    return this;
  }

  skewX(value: number): ViewBox;
  skewX(value: number, cx: number, cy: number): ViewBox;
  skewX(value: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewX(value);
    this.matrix.translate(-local.x, -local.y);

    return this;
  }

  skewY(value: number): ViewBox;
  skewY(value: number, cx: number, cy: number): ViewBox;
  skewY(value: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewY(value);
    this.matrix.translate(-local.x, -local.y);

    return this;
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

  reset() {
    this.matrix = new Matrix2D();

    this.zoom = 1;
    return this;
  }

  toCSS() {
    const mtx = this.getMatrix();
    // mtx.appendMatrix(this.flipMatrix);
    return `matrix(${mtx.a},${mtx.b},${mtx.c},${mtx.d},${mtx.tx},${mtx.ty})`;
  }
}
