# ViewBox

## Install

```sh
npm install @bplok20010/viewbox
```

## Usage

```ts
import { ViewBox } from "@bplok20010/viewbox";

const viewBox = new ViewBox({
  transformOrigin: {
    x: 100,
    y: 100,
  },
});

viewBox.setZoom(2);
viewBox.rotate(30);
viewBox.flipX();
viewBox.translate(200, 200);

console.log(viewBox.toCSS());
console.log(viewBox.getMatrix());
```

## types

```ts
import { Matrix2D } from "matrix2d.js";
import type { IPoint, IRect } from "./types";
export interface IViewBoxOptions {
  matrix?: [number, number, number, number, number, number];
  transformOrigin?: IPoint;
}
export interface ViewBoxJSON {
  options: {
    transformOrigin: IPoint;
  };
  matrix: [number, number, number, number, number, number];
}
/**
 * ViewBox
 */
export declare class ViewBox {
  protected options: IViewBoxOptions;
  protected _matrix: Matrix2D;
  protected transformOrigin: IPoint;
  protected useDecompose: boolean;
  get matrix(): Matrix2D;
  set matrix(mtx: Matrix2D);
  get transform(): {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
  };
  constructor(options?: IViewBoxOptions);
  protected decompose(): import("matrix2d.js").Transform;
  protected get cx(): number;
  protected get cy(): number;
  setTransformOrigin(x: number, y: number): void;
  getTransformOrigin(): {
    x: number;
    y: number;
  };
  get x(): number;
  set x(value: number);
  get y(): number;
  set y(value: number);
  getPosition(): {
    x: number;
    y: number;
  };
  setPosition(x: number, y: number): this;
  setMatrix(matrix: [a: number, b: number, c: number, d: number, tx: number, ty: number]): this;
  getMatrix(): [a: number, b: number, c: number, d: number, tx: number, ty: number];
  /**
   * 绝对坐标(相对viewBox)转本地坐标(viewBox内容实际坐标)
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.globalToLocal(0, 0) // {x: -100, y: -100}
   */
  globalToLocal(x: number, y: number): import("matrix2d.js").Point;
  /**
   * 本地坐标(viewBox内容实际坐标)转绝对坐标(相对viewBox)
   * @examples
   * viewBox.translate(100, 100)
   * viewBox.localToGlobal(-100, -100) // {x: 0, y: 0}
   */
  localToGlobal(x: number, y: number): import("matrix2d.js").Point;
  /**
   * 对viewBox内容进行平移
   * @param x 相对viewBox的（绝对坐标）x偏移量
   * @param y 同上 y偏移量
   * @returns
   */
  translate(x: number, y: number): this;
  translateX(x: number): this;
  translateY(y: number): this;
  /**
   * 对viewBox内容进行缩放，cx,cy均指相对viewBox（绝对坐标）
   * 缩放值scaleX 和 scaleY 叠加上一个缩放值，eg: scale(2,2) scale(3,3) 实际缩放内容为：x、y都缩放了6倍
   * @param scaleX
   * @param scaleY
   */
  scale(scaleX: number, scaleY: number): ViewBox;
  scale(scaleX: number, scaleY: number, cx: number, cy: number): ViewBox;
  /**
   * 对viewBox内容进行旋转，cx,cy均指相对viewBox（绝对坐标）
   * @param rotation 需要旋转的角度，该值会和上一次选择值叠加，eg: rotate(10) rotate(10)，实际旋转角度为：20
   */
  rotate(rotation: number): ViewBox;
  rotate(rotation: number, cx: number, cy: number): ViewBox;
  /**
   * x 轴翻转，多次调用侧反复翻转
   * cx,cy均指相对viewBox（绝对坐标）
   */
  flipX(): ViewBox;
  flipX(cx: number, cy: number): ViewBox;
  /**
   * y 轴翻转，多次调用侧反复翻转
   * cx,cy均指相对viewBox（绝对坐标）
   */
  flipY(): ViewBox;
  flipY(cx: number, cy: number): ViewBox;
  /**
   * 获取当前缩放值
   * @returns
   */
  getZoom(): number;
  /**
   * 视图缩放，该缩放值是全量值，多次调用会覆盖上一次，如：setZoom(2) setZoom(4)，实际的缩放值为：4
   * @param value 缩放值，全量值
   */
  setZoom(value: number): ViewBox;
  setZoom(value: number, cx: number, cy: number): ViewBox;
  /**
   * 视图旋转，该缩放值是全量值，多次调用会覆盖上一次，如：setRotation(10) setZoom(30)，实际的缩放值为：30
   * @param value 旋转角度，全量值
   */
  setRotation(rotation: number): ViewBox;
  setRotation(rotation: number, cx: number, cy: number): ViewBox;
  /**
   * 自动对指定区域进行缩放，并将区域中心移动到指定的坐标，该区域为viewBox内容的实际区域，非全局坐标的区域
   * @param rect
   */
  zoomToRect(
    rect: IRect,
    options?: {
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
    }
  ): this;
  reset(): this;
  toCSS(): string;
  clone(): ViewBox;
}
```

## Dev

```
yarn

```
