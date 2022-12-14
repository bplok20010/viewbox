import { Matrix2D } from "matrix2d.js";

import type { IPoint, IRect } from "./types";

export interface IViewBoxOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  transformOrigin?: IPoint;
  /**
   * 是否记录旋转、缩放等信息，否则使用decompose获取，不建议开启
   */
  useDecompose?: boolean;
}

const FlipMode = "mirror"; // mirror none

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;

export interface ViewBoxJSON {
  options: {
    width: number;
    height: number;
    transformOrigin: IPoint;
    useDecompose: boolean;
  };
  matrix: [number, number, number, number, number, number];
  transform: {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
  };
}
/**
 * ViewBox
 */
export class ViewBox {
  static formJSON({ options, matrix, transform }: ViewBoxJSON) {
    const mtx = new Matrix2D(...matrix);

    const viewBox = new ViewBox(options);

    viewBox.setMatrix(mtx);

    viewBox.transform = {
      ...transform,
    } as any;

    return viewBox;
  }

  protected options: IViewBoxOptions;
  protected matrix = new Matrix2D();
  protected transformOrigin: IPoint = { x: 0, y: 0 };
  protected useDecompose = false;

  protected _transform = {
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    flipX: false,
    flipY: false,
    // translateX: 0,
    // translateY: 0,
  };

  get transform(): {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    flipX: boolean;
    flipY: boolean;
  } {
    if (!this.useDecompose) {
      const r = this._transform as any;

      r.x = this.matrix.tx;
      r.y = this.matrix.ty;

      return r;
    }

    const transform = this.decompose();

    return {
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      ...transform,
    };
  }

  set transform(value) {
    this._transform = value;
  }

  width = DEFAULT_WIDTH;
  height = DEFAULT_HEIGHT;

  constructor(options: IViewBoxOptions = {}) {
    this.options = options;
    this.width = options.width ?? DEFAULT_WIDTH;
    this.height = options.height ?? DEFAULT_HEIGHT;

    this.useDecompose = options.useDecompose ?? false;

    this.transformOrigin = options.transformOrigin || this.transformOrigin;

    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
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

  protected rebuildMatrix() {
    const matrix = new Matrix2D();
    const { x, y, scaleX, scaleY, rotation, skewX, skewY, flipX, flipY } = this.transform;

    matrix.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    matrix.skew(skewX, skewY);
    matrix.scale(scaleX, scaleY);
    matrix.rotate(rotation);

    this.matrix = matrix;

    this.x = x;
    this.y = y;
  }

  protected _saveContext = {
    x: 0,
    y: 0,
  };

  protected _save() {
    this._saveContext.x = this.x;
    this._saveContext.y = this.y;
  }

  protected _restore() {
    this.x = this._saveContext.x;
    this.y = this._saveContext.y;
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

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
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
    return this.transform.scaleX;
  }

  /**
   * scale based on center point
   */
  set zoom(value: number) {
    this.setZoom(value);
  }

  protected updateMatrix() {
    const matrix = new Matrix2D();
    const { rotation, scaleX, scaleY, flipX, flipY, skewX, skewY } = this.transform;

    // const originX = this.x;
    // const originY = this.y;

    matrix.rotate(rotation);
    matrix.scale(scaleX, scaleY);
    matrix.skew(skewX, skewY);

    if (FlipMode === "mirror") {
      const mtx = new Matrix2D();
      mtx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      matrix.prependMatrix(mtx);
    } else {
      matrix.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    }

    this.matrix = matrix;

    // this.x = originX;
    // this.y = originY;
  }

  protected setMatrix(mtx: Matrix2D) {
    this.matrix = mtx;
  }

  getMatrix() {
    return this.matrix.clone();
  }

  /**
   * 绝对坐标(相对viewBox)转本地坐标(viewBox内容实际坐标)
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.globalToLocal(0, 0) // {x: -100, y: -100}
   */
  globalToLocal(x: number, y: number) {
    return this.getMatrix().invert().transformPoint(x, y);
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
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    // this.matrix.scale(scaleX, scaleY, local.x, local.y);

    this.transform.scaleX += scaleX;
    this.transform.scaleY += scaleY;

    const matrix = new Matrix2D();
    matrix.scale(scaleX, scaleY, cx, cy);

    const nextPos = matrix.transformPoint(this.x, this.y);

    this.updateMatrix();

    this.x = nextPos.x;
    this.y = nextPos.y;

    return this;
  }

  /**
   * 对viewBox内容进行旋转，cx,cy均指相对viewBox（绝对坐标）
   * @param rotation 需要旋转的角度，该值会和上一次选择值叠加，eg: rotate(10) rotate(10)，实际旋转角度为：20
   */
  rotate(rotation: number): ViewBox;
  rotate(rotation: number, cx: number, cy: number): ViewBox;
  rotate(rotation: number, cx?: number, cy?: number) {
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);
    const { flipX, flipY } = this.transform;

    this.matrix.rotate(rotation, local.x, local.y);

    this.transform.rotation += rotation;

    // const matrix = new Matrix2D();
    // matrix.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    // matrix.rotate(rotation, cx, cy);

    // const nextPos = matrix.transformPoint(this.x, this.y);

    // this.updateMatrix();

    // this.x = nextPos.x;
    // this.y = nextPos.y;

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

    const mtx = new Matrix2D();
    mtx.scale(-1, 1, cx, cy);

    const nextPos = mtx.transformPoint(this.x, this.y);

    this.transform.flipX = !this.transform.flipX;

    this.updateMatrix();

    this.x = nextPos.x;
    this.y = nextPos.y;

    // if (FlipMode === "mirror") {
    //   const originX = this.x;

    //   const vx = -(originX - cx);

    //   const mtx = new Matrix2D();

    //   mtx.scale(-1, 1, local.x, local.y);

    //   this.matrix.prependMatrix(mtx);

    //   // 重置x
    //   // FIX: 修复在旋转及缩放如0.5倍的情况下，反复翻转导致精度丢失的显示异常问题
    //   this.x = cx + vx;
    // } else {
    //   this.matrix.scale(-1, 1, local.x, local.y);
    // }

    // this.transform.flipX = !this.transform.flipX;

    // this.rebuildMatrix();

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
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    const mtx = new Matrix2D();
    mtx.scale(1, -1, cx, cy);

    const nextPos = mtx.transformPoint(this.x, this.y);

    this.transform.flipY = !this.transform.flipY;

    this.updateMatrix();

    this.x = nextPos.x;
    this.y = nextPos.y;

    // if (FlipMode === "mirror") {
    //   const originY = this.y;

    //   const vy = -(originY - cy);

    //   const mtx = new Matrix2D();

    //   mtx.scale(1, -1, local.x, local.y);

    //   this.matrix.prependMatrix(mtx);

    //   // 重置y
    //   // FIX: 修复在旋转及缩放如0.5倍的情况下，反复翻转导致精度丢失的显示异常问题
    //   this.y = cy + vy;
    // } else {
    //   this.matrix.scale(1, -1, local.x, local.y);
    // }

    // this.transform.flipY = !this.transform.flipY;

    // this.rebuildMatrix();

    return this;
  }

  skewX(value: number): ViewBox;
  skewX(value: number, cx: number, cy: number): ViewBox;
  skewX(value: number, cx?: number, cy?: number) {
    if (!value) return this;

    cx = cx ?? this.cx;
    cy = cy ?? this.cy;
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewX(value);
    this.matrix.translate(-local.x, -local.y);

    this.transform.skewX += value;

    // console.log("skewX", value);

    // const matrix = new Matrix2D();
    // matrix.translate(cx, cy);
    // matrix.skewX(value);
    // matrix.translate(-cx, -cy);

    // const nextPos = matrix.transformPoint(this.x, this.y);

    // this.updateMatrix();

    // this.x = nextPos.x;
    // this.y = nextPos.y;

    return this;
  }

  skewY(value: number): ViewBox;
  skewY(value: number, cx: number, cy: number): ViewBox;
  skewY(value: number, cx?: number, cy?: number) {
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewY(value);
    this.matrix.translate(-local.x, -local.y);

    this.transform.skewY += value;

    // const matrix = new Matrix2D();
    // matrix.translate(cx, cy);
    // matrix.skewY(value);
    // matrix.translate(-cx, -cy);

    // const nextPos = matrix.transformPoint(this.x, this.y);

    // this.updateMatrix();

    // this.x = nextPos.x;
    // this.y = nextPos.y;

    return this;
  }

  /**
   * 获取当前缩放值
   * @returns
   */
  getZoom() {
    return this.zoom;
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

    // const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);
    // this.matrix.scale(value / scaleX, value / scaleY, local.x, local.y);

    cx = cx ?? this.cx;
    cy = cy ?? this.cy;

    const deltaX = this.x - cx;
    const deltaY = this.y - cy;

    this.transform.scaleX = value;
    this.transform.scaleY = value;
    this.updateMatrix();

    this.x = cx + deltaX * (value / scaleX);
    this.y = cy + deltaY * (value / scaleY);

    return this;
  }

  /**
   * 视图旋转，该缩放值是全量值，多次调用会覆盖上一次，如：setRotation(10) setZoom(30)，实际的缩放值为：30
   * @param value 旋转角度，全量值
   */
  setRotation(rotation: number): ViewBox;
  setRotation(rotation: number, cx: number, cy: number): ViewBox;
  setRotation(rotation: number, cx?: number, cy?: number) {
    cx = cx ?? this.cx;
    cy = cy ?? this.cy;

    const delta = rotation - this.transform.rotation;

    // const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);
    // this.matrix.rotate(delta, local.x, local.y);

    this.rotate(delta, cx, cy);

    // const matrix = new Matrix2D();
    // matrix.rotate(delta, cx, cy);

    // const nextPos = matrix.transformPoint(this.x, this.y);
    // this.transform.rotation = rotation;

    // this.updateMatrix();

    // this.x = nextPos.x;
    // this.y = nextPos.y;

    return this;
  }

  /**
   * 斜切x，可能会无法还原，慎用
   * @param value
   */
  setSkewX(value: number): ViewBox;
  setSkewX(value: number, cx: number, cy: number): ViewBox;
  setSkewX(value: number, cx?: number, cy?: number): ViewBox {
    if (this.useDecompose) {
      console.warn("[ViewBox] useDecompose is enabled! please use skewX() instead！");
    }

    const delta = value - this.transform.skewX;

    this.skewX(delta, cx, cy);

    this.transform.skewX = value;

    return this;
  }

  /**
   * 斜切y，可能会无法还原，慎用
   * @param value
   */
  setSkewY(value: number): ViewBox;
  setSkewY(value: number, cx: number, cy: number): ViewBox;
  setSkewY(value: number, cx?: number, cy?: number): ViewBox {
    if (this.useDecompose) {
      console.warn("[ViewBox] useDecompose is enabled! please use skewY() instead！");
    }

    const delta = value - this.transform.skewY;

    this.skewY(delta, cx, cy);

    this.transform.skewY = value;

    return this;
  }

  /**
   * 自动对指定区域进行缩放，并将区域中心移动到指定的坐标，该区域为viewBox内容的实际区域，非全局坐标的区域
   * @param rect
   */
  zoomToRect(
    rect: IRect,
    options: {
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
    const padding = options.padding ?? 0;

    const vWidth = this.width - padding * 2;
    const vHeight = this.height - padding * 2;

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

    this.transform = {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
    } as any;

    return this;
  }

  toCSS() {
    const mtx = this.getMatrix();
    return `matrix(${mtx.a},${mtx.b},${mtx.c},${mtx.d},${mtx.tx},${mtx.ty})`;
  }

  clone() {
    const viewBox = new ViewBox({
      width: this.width,
      height: this.height,
      transformOrigin: this.transformOrigin,
      useDecompose: this.useDecompose,
    });

    viewBox.transform = {
      ...this.transform,
    };

    viewBox.matrix = this.getMatrix();

    return viewBox;
  }

  toJSON(): ViewBoxJSON {
    const { a, b, c, d, tx, ty } = this.matrix;

    return {
      options: {
        width: this.width,
        height: this.height,
        transformOrigin: this.transformOrigin,
        useDecompose: this.useDecompose,
      },
      matrix: [a, b, c, d, tx, ty] as [number, number, number, number, number, number],
      transform: {
        ...this.transform,
      },
    };
  }
}
