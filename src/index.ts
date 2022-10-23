import { Matrix2D } from "matrix2d.js";

import type { IPoint, IRect } from "./types";

export interface IViewBoxOptions {
  matrix?: [number, number, number, number, number, number];
  transformOrigin?: IPoint;
}

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

export interface ViewBoxJSON {
  options: {
    transformOrigin: IPoint;
  };
  matrix: [number, number, number, number, number, number];
}
/**
 * ViewBox
 */
export class ViewBox {
  protected options: IViewBoxOptions;
  protected _matrix = new Matrix2D();
  protected transformOrigin: IPoint = { x: 0, y: 0 };
  protected useDecompose = true;

  get matrix() {
    return this._matrix;
  }

  set matrix(mtx: Matrix2D) {
    this._matrix = mtx;
  }

  get transform(): {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
  } {
    return this.decompose();
  }

  constructor(options: IViewBoxOptions = {}) {
    this.options = options;

    this.transformOrigin = options.transformOrigin || this.transformOrigin;
    if (options.matrix) {
      const mtx = new Matrix2D(...options.matrix);
      this.matrix = mtx;
    }
  }

  protected decompose() {
    return this.matrix.decompose();
  }

  protected get cx() {
    return this.transformOrigin.x;
  }

  protected get cy() {
    return this.transformOrigin.y;
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

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  setMatrix(matrix: [a: number, b: number, c: number, d: number, tx: number, ty: number]) {
    this.matrix = new Matrix2D(...matrix);

    return this;
  }

  getMatrix(): [a: number, b: number, c: number, d: number, tx: number, ty: number] {
    const { a, b, c, d, tx, ty } = this.matrix;
    return [a, b, c, d, tx, ty];
  }

  /**
   * 绝对坐标(相对viewBox)转本地坐标(viewBox内容实际坐标)
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.globalToLocal(0, 0) // {x: -100, y: -100}
   */
  globalToLocal(x: number, y: number) {
    return this.matrix.clone().invert().transformPoint(x, y);
  }

  /**
   * 本地坐标(viewBox内容实际坐标)转绝对坐标(相对viewBox)
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.localToGlobal(-100, -100) // {x: 0, y: 0}
   */
  localToGlobal(x: number, y: number) {
    return this.matrix.transformPoint(x, y);
  }

  /**
   * 对viewBox内容进行平移
   * @param x 相对viewBox的（绝对坐标）x偏移量
   * @param y 同上 y偏移量
   * @returns
   */
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
   * 对viewBox内容进行缩放，cx,cy均指相对viewBox（绝对坐标）
   * 缩放值scaleX 和 scaleY 叠加上一个缩放值，eg: scale(2,2) scale(3,3) 实际缩放内容为：x、y都缩放了6倍
   * @param scaleX
   * @param scaleY
   */
  scale(scaleX: number, scaleY: number): ViewBox;
  scale(scaleX: number, scaleY: number, cx: number, cy: number): ViewBox;
  scale(scaleX: number, scaleY: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.scale(scaleX, scaleY, local.x, local.y);

    return this;
  }

  /**
   * 对viewBox内容进行旋转，cx,cy均指相对viewBox（绝对坐标）
   * @param rotation 需要旋转的角度，该值会和上一次选择值叠加，eg: rotate(10) rotate(10)，实际旋转角度为：20
   */
  rotate(rotation: number): ViewBox;
  rotate(rotation: number, cx: number, cy: number): ViewBox;
  rotate(rotation: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.rotate(rotation, local.x, local.y);

    return this;
  }

  /**
   * x 轴翻转，多次调用侧反复翻转
   * cx,cy均指相对viewBox（绝对坐标）
   */
  flipX(): ViewBox;
  flipX(cx: number, cy: number): ViewBox;
  flipX(cx?: number, cy?: number) {
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;
    const local = this.globalToLocal(cx, cy);

    const originX = this.x;

    const vx = -(originX - cx);

    const mtx = new Matrix2D();

    mtx.scale(-1, 1, local.x, local.y);

    this.matrix.prependMatrix(mtx);

    // 重置x
    // FIX: 修复在旋转及缩放如0.5倍的情况下，反复翻转导致精度丢失的显示异常问题
    this.x = cx + vx;

    return this;
  }

  /**
   * y 轴翻转，多次调用侧反复翻转
   * cx,cy均指相对viewBox（绝对坐标）
   */
  flipY(): ViewBox;
  flipY(cx: number, cy: number): ViewBox;
  flipY(cx?: number, cy?: number) {
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;
    const local = this.globalToLocal(cx, cy);

    const originY = this.y;

    const vy = -(originY - cy);

    const mtx = new Matrix2D();

    mtx.scale(1, -1, local.x, local.y);

    this.matrix.prependMatrix(mtx);

    // 重置y
    // FIX: 修复在旋转及缩放如0.5倍的情况下，反复翻转导致精度丢失的显示异常问题
    this.y = cy + vy;

    return this;
  }

  skewX(value: number): ViewBox;
  skewX(value: number, cx: number, cy: number): ViewBox;
  skewX(value: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewX(value);
    this.matrix.translate(-local.x, -local.y);

    // this.transform.skewX += value;

    return this;
  }

  skewY(value: number): ViewBox;
  skewY(value: number, cx: number, cy: number): ViewBox;
  skewY(value: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewY(value);
    this.matrix.translate(-local.x, -local.y);

    // this.transform.skewY += value;

    return this;
  }

  /**
   * 获取当前缩放值
   * @returns
   */
  getZoom() {
    return this.transform.scaleX;
  }

  /**
   * 视图缩放，该缩放值是全量值，多次调用会覆盖上一次，如：setZoom(2) setZoom(4)，实际的缩放值为：4
   * @param value 缩放值，全量值
   */
  setZoom(value: number): ViewBox;
  setZoom(value: number, cx: number, cy: number): ViewBox;
  setZoom(value: number, cx?: number, cy?: number) {
    const scaleX = this.transform.scaleX;
    const scaleY = this.transform.scaleY;

    this.scale(value / scaleX, value / scaleY, cx, cy);

    return this;
  }

  /**
   * 视图旋转，该缩放值是全量值，多次调用会覆盖上一次，如：setRotation(10) setZoom(30)，实际的缩放值为：30
   * @param value 旋转角度，全量值
   */
  setRotation(rotation: number): ViewBox;
  setRotation(rotation: number, cx: number, cy: number): ViewBox;
  setRotation(rotation: number, cx?: number, cy?: number) {
    const delta = rotation - this.transform.rotation;

    this.rotate(delta, cx, cy);

    return this;
  }

  /**
   * 自动对指定区域进行缩放，并将区域中心移动到指定的坐标，该区域为viewBox内容的实际区域，非全局坐标的区域
   * @param rect
   */
  zoomToRect(
    rect: IRect,
    options: {
      size?: {
        width: number;
        height: number;
      };
      /**
       * 自定义缩放值
       */
      scale?: number;
      /**
       * 距离viewbox的边界距离
       */
      padding?: number;
      /**
       * 自定义缩放中心坐标
       */
      transformOrigin?: IPoint;
    } = {}
  ) {
    const size = options?.size || {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    };
    const padding = options.padding ?? 0;

    const vWidth = size.width - padding * 2;
    const vHeight = size.height - padding * 2;

    const scale = options.scale ?? Math.min(vWidth / rect.width, vHeight / rect.height);

    const cx = options.transformOrigin ? options.transformOrigin.x : this.cx;
    const cy = options.transformOrigin ? options.transformOrigin.y : this.cy;

    const rectCx = rect.x + rect.width / 2;
    const rectCy = rect.y + rect.height / 2;

    const p0 = this.localToGlobal(rectCx, rectCy);
    const p1 = {
      x: cx,
      y: cy,
    };

    this.setZoom(scale, p0.x, p0.y);

    const tx = p1.x - p0.x;
    const ty = p1.y - p0.y;

    this.translate(tx, ty);

    return this;
  }

  reset() {
    this.matrix = new Matrix2D();

    return this;
  }

  toCSS() {
    const mtx = this.getMatrix();
    return `matrix(${mtx.join(",")})`;
  }

  clone() {
    const viewBox = new ViewBox({
      transformOrigin: this.transformOrigin,
      matrix: this.getMatrix(),
    });

    return viewBox;
  }
}
