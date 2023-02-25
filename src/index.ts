import { Matrix2D } from "matrix2d.js";

import type { IPoint, IRect } from "./types";

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  skewX: number;
  skewY: number;
}

export interface IViewBoxOptions {
  transform?: Partial<Transform>;
  transformOrigin?: IPoint;
}

export interface IZoomToRectOptions {
  /**
   * 视图宽高,默认400x400
   */
  size?: {
    width: number;
    height: number;
  };
  /**
   * 自定义缩放值
   */
  scale?: number;
  /**
   * 距离视图的边界距离
   */
  padding?: number;
  /**
   * 自定义缩放中心坐标
   */
  transformOrigin?: IPoint;
}

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

function getDefaultTransform(): Transform {
  return {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
    skewX: 0,
    skewY: 0,
  };
}

/**
 * ViewBox
 */
export class ViewBox {
  protected options: IViewBoxOptions;
  protected _matrix = new Matrix2D();
  protected _transform: Transform = getDefaultTransform();
  protected transformOrigin: IPoint = { x: 0, y: 0 };

  protected get matrix() {
    return this._matrix;
  }

  protected set matrix(mtx: Matrix2D) {
    this._matrix = mtx;
  }

  protected get transform(): Transform {
    this._transform.x = this.x;
    this._transform.y = this.y;

    return this._transform;
    // return this.decompose();
  }

  protected set transform(value: Partial<Transform>) {
    this._transform = {
      ...this._transform,
      ...value,
    };
  }

  constructor(options: IViewBoxOptions = {}) {
    this.options = options;

    this.transformOrigin = options.transformOrigin || this.transformOrigin;
    if (options.transform) {
      this.setTransform(options.transform);
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

  getTransform() {
    const { a, b, c, d, tx, ty } = this.matrix;
    return {
      ...this.transform,
      a,
      b,
      c,
      d,
      x: tx,
      y: ty,
    };
  }

  setTransform(transform: Partial<Transform>) {
    const { a = 1, b = 0, c = 0, d = 1, x = 0, y = 0 } = transform;

    const matrix = new Matrix2D(a, b, c, d, x, y);
    const decompose = matrix.decompose();

    this.transform = {
      ...getDefaultTransform(),
      scaleX: decompose.scaleX,
      scaleY: decompose.scaleY,
      rotation: decompose.rotation,
      x: decompose.x,
      y: decompose.y,
      ...transform,
    };

    this.matrix = matrix;

    return this;
  }

  getMatrixObject() {
    return this.matrix.clone();
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
    return this.getMatrixObject().invert().transformPoint(x, y);
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
    this.matrix.prepend(1, 0, 0, 1, x, y);

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
    const m0 = new Matrix2D();
    m0.scale(scaleX, scaleY, cx ?? this.cx, cy ?? this.cy);

    this.matrix.prependMatrix(m0);

    this.transform.scaleX *= scaleX;
    this.transform.scaleY *= scaleY;

    return this;
  }

  /**
   * 对viewBox内容进行旋转，cx,cy均指相对viewBox（绝对坐标）
   * @param rotation 需要旋转的角度，该值会和上一次选择值叠加，eg: rotate(10) rotate(10)，实际旋转角度为：20
   */
  rotate(rotation: number): ViewBox;
  rotate(rotation: number, cx: number, cy: number): ViewBox;
  rotate(rotation: number, cx?: number, cy?: number) {
    const m0 = new Matrix2D();
    m0.rotate(rotation, cx ?? this.cx, cy ?? this.cy);

    this.matrix.prependMatrix(m0);

    this.transform.rotation += rotation;

    return this;
  }

  /**
   * x 轴翻转
   * cx,cy均指相对viewBox（绝对坐标）
   */
  flipX(): ViewBox;
  flipX(cx: number, cy: number): ViewBox;
  flipX(cx?: number, cy?: number) {
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;

    const m0 = new Matrix2D();
    m0.flipX(cx, cy);

    this.matrix.prependMatrix(m0);

    this.transform.flipX = !this.transform.flipX;

    return this;
  }

  /**
   * y 轴翻转
   * cx,cy均指相对viewBox（绝对坐标）
   */
  flipY(): ViewBox;
  flipY(cx: number, cy: number): ViewBox;
  flipY(cx?: number, cy?: number) {
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;

    const m0 = new Matrix2D();
    m0.flipY(cx, cy);

    this.matrix.prependMatrix(m0);

    this.transform.flipX = !this.transform.flipX;

    return this;
  }

  skewX(value: number): ViewBox;
  skewX(value: number, cx: number, cy: number): ViewBox;
  skewX(value: number, cx?: number, cy?: number) {
    const m0 = new Matrix2D();
    m0.skewX(value, cx ?? this.cx, cy ?? this.cy);

    this.matrix.prependMatrix(m0);

    this.transform.skewX += value;

    return this;
  }
  /**
   * @param value 全量值
   * @param cx
   * @param cy
   */
  setSkewX(value: number): ViewBox;
  setSkewX(value: number, cx: number, cy: number): ViewBox;
  setSkewX(value: number, cx?: number, cy?: number) {
    const skewX = this.transform.skewX;
    const m0 = new Matrix2D();
    m0.skewX(value - skewX, cx ?? this.cx, cy ?? this.cy);

    this.matrix.prependMatrix(m0);

    this.transform.skewX = value;

    return this;
  }

  /**
   * @param value
   * @param cx
   * @param cy
   */
  skewY(value: number): ViewBox;
  skewY(value: number, cx: number, cy: number): ViewBox;
  skewY(value: number, cx?: number, cy?: number) {
    const m0 = new Matrix2D();
    m0.skewY(value, cx ?? this.cx, cy ?? this.cy);

    this.matrix.prependMatrix(m0);

    this.transform.skewY += value;

    return this;
  }

  /**
   * @param value 全量值
   * @param cx
   * @param cy
   */
  setSkewY(value: number): ViewBox;
  setSkewY(value: number, cx: number, cy: number): ViewBox;
  setSkewY(value: number, cx?: number, cy?: number) {
    const skewY = this.transform.skewY;
    const m0 = new Matrix2D();
    m0.skewY(value - skewY, cx ?? this.cx, cy ?? this.cy);

    this.matrix.prependMatrix(m0);

    this.transform.skewY = value;

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
   * 避免精度问题，建议使用scale
   * @param value 缩放值，全量值
   */
  setZoom(value: number): ViewBox;
  setZoom(value: number, cx: number, cy: number): ViewBox;
  setZoom(value: number, cx?: number, cy?: number) {
    const scaleX = this.transform.scaleX;
    const scaleY = this.transform.scaleY;

    this.transform.scaleX = value;
    this.transform.scaleY = value;

    cx = cx ?? this.cx;
    cy = cy ?? this.cy;

    const m0 = new Matrix2D();
    m0.scale(value / scaleX, value / scaleY, cx, cy);

    this.matrix.prependMatrix(m0);

    return this;
  }

  /**
   * 视图旋转，该缩放值是全量值，多次调用会覆盖上一次，如：setRotation(10) setZoom(30)，实际的缩放值为：30
   * 避免精度问题，建议使用rotate
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
   * 缩放以显示指定矩形区域(基于视图的区域)内容，并将区域中心移动到指定的坐标(transformOrigin)
   * @param rect
   */
  zoomToRect(rect: IRect, options: IZoomToRectOptions = {}) {
    if (!rect) {
      return this;
    }

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

    this.translate(cx - rectCx, cy - rectCy);
    this.scale(scale, scale, cx, cy);

    return this;
  }

  /**
   * 缩放以居中显示指定矩形区域内容
   * @returns
   */
  zoomToFit(rect: IRect, options: Omit<IZoomToRectOptions, "transformOrigin"> = {}) {
    const size = options?.size || {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    };

    return this.zoomToRect(rect, {
      ...options,
      transformOrigin: {
        x: size.width / 2,
        y: size.height / 2,
      },
    });
  }

  reset() {
    this.matrix = new Matrix2D();

    return this;
  }

  toCSS() {
    const mtx = this.getMatrix();
    return `matrix(${mtx.join(",")})`;
  }

  /**
   * alias toCSS
   * @returns
   */
  toString() {
    return this.toCSS();
  }

  clone() {
    const viewBox = new ViewBox({
      transformOrigin: this.getTransformOrigin(),
      transform: this.getTransform(),
    });

    return viewBox;
  }
}
