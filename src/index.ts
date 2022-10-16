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

/**
 * ViewBox v1
 */
export class ViewBox {
  protected options: IViewBoxOptions;
  protected matrix = new Matrix2D();
  protected transformOrigin: IPoint;

  protected transform = {
    scale: 1,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    flipX: false,
    flipY: false,
  };

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

  get currentScale() {
    return this.transform.scale;
  }

  get currentRotation() {
    return this.transform.rotation;
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
    return this.transform.scaleX;
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

  scale(scaleX: number, scaleY: number): ViewBox;
  scale(scaleX: number, scaleY: number, cx: number, cy: number): ViewBox;
  scale(scaleX: number, scaleY: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.scale(scaleX, scaleY, local.x, local.y);

    this.transform.scaleX += scaleX;
    this.transform.scaleY += scaleY;

    return this;
  }

  rotate(rotation: number): ViewBox;
  rotate(rotation: number, cx: number, cy: number): ViewBox;
  rotate(rotation: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.rotate(rotation, local.x, local.y);

    this.transform.rotation += rotation;

    return this;
  }

  flipX(): ViewBox;
  flipX(cx: number, cy: number): ViewBox;
  flipX(cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.scale(-1, 1, local.x, local.y);

    this.transform.flipX = !this.transform.flipX;

    return this;
  }

  flipY(): ViewBox;
  flipY(cx: number, cy: number): ViewBox;
  flipY(cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.scale(1, -1, local.x, local.y);

    this.transform.flipY = !this.transform.flipY;

    return this;
  }

  skewX(value: number): ViewBox;
  skewX(value: number, cx: number, cy: number): ViewBox;
  skewX(value: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewX(value);
    this.matrix.translate(-local.x, -local.y);

    this.transform.skewX += value;

    return this;
  }

  skewY(value: number): ViewBox;
  skewY(value: number, cx: number, cy: number): ViewBox;
  skewY(value: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.translate(local.x, local.y);
    this.matrix.skewY(value);
    this.matrix.translate(-local.x, -local.y);

    this.transform.skewY += value;

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
   * 视图缩放
   * @param value 缩放值，全量值
   * @param zoomPoint 缩放坐标。默认为当前视图中心点
   */
  setZoom(value: number): ViewBox;
  setZoom(value: number, cx: number, cy: number): ViewBox;
  setZoom(value: number, cx?: number, cy?: number) {
    const scaleX = this.transform.scaleX;
    const scaleY = this.transform.scaleY;

    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    this.matrix.scale(value / scaleX, value / scaleY, local.x, local.y);

    this.transform.scaleX = value;
    this.transform.scaleY = value;

    return this;
  }

  setRotation(rotation: number): ViewBox;
  setRotation(rotation: number, cx: number, cy: number): ViewBox;
  setRotation(rotation: number, cx?: number, cy?: number) {
    const local = this.globalToLocal(cx ?? this.cx, cy ?? this.cy);

    const c = this.transform;

    this.matrix.rotate(rotation - c.rotation, local.x, local.y);

    this.transform.rotation = rotation;

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

    //////////////////////////适配rect TODO://////////////////////////
    // // 先将 scale 重置 1
    // this.setZoom(1);
    // // 将给定的相对坐标转换为绝对坐标
    // let points = [
    //   {
    //     x: rect.x,
    //     y: rect.y,
    //   },
    //   {
    //     x: rect.x + rect.width,
    //     y: rect.y,
    //   },
    //   {
    //     x: rect.x + rect.width,
    //     y: rect.y + rect.height,
    //   },
    //   {
    //     x: rect.x,
    //     y: rect.y + rect.height,
    //   },
    // ].map((point) => {
    //   return this.localToGlobal(point.x, point.y);
    // });

    // let xX = points.map((point) => point.x);
    // let yY = points.map((point) => point.y);

    // let minX = Math.min(...xX);
    // let minY = Math.min(...yY);
    // let maxX = Math.max(...xX);
    // let maxY = Math.max(...yY);

    // // 构建全局的rect，
    // rect = {
    //   x: minX,
    //   y: minY,
    //   width: maxX - minX,
    //   height: maxY - minY,
    // };

    // // 将坐标重新转换
    // points = [
    //   {
    //     x: rect.x,
    //     y: rect.y,
    //   },
    //   {
    //     x: rect.x + rect.width,
    //     y: rect.y + rect.height,
    //   },
    // ].map((point) => {
    //   return this.globalToLocal(point.x, point.y);
    // });

    // // 再次构建新的rect
    // rect = {
    //   x: points[0].x,
    //   y: points[0].y,
    //   width: points[1].x - points[0].x,
    //   height: points[1].y - points[0].y,
    // };

    //////////////////////////适配rect End//////////////////////////

    const scale = options.scale ?? Math.min(vWidth / rect.width, vHeight / rect.height);

    const cx = this.width / 2;
    const cy = this.height / 2;

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
      scale: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
    };

    return this;
  }

  toCSS() {
    const mtx = this.getMatrix();
    return `matrix(${mtx.a},${mtx.b},${mtx.c},${mtx.d},${mtx.tx},${mtx.ty})`;
  }
}
