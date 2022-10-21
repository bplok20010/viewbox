import React from "react";
import "./styles.css";
import * as dat from "dat.gui";

import bg from "./bg.png";

import { ViewBox } from "../../src/index";

const vw = 600;
const vh = 400;

const rect = {
  left: 440,
  top: 240,
  width: 70,
  height: 80,
};

export default function App() {
  const [matrix, updateMatrix] = React.useState("matrix(1,0,0,1,0,0)");
  const [center, setCenter] = React.useState({
    x: vw / 2,
    y: vh / 2,
  });

  React.useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastSkewX = 0;
    let lastSkewY = 0;

    const setting = {
      cx: vw / 2,
      cy: vh / 2,
      x: 0,
      y: 0,
      zoom: 1.0,
      rotation: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      zoomToFit: false,
    };

    const viewBox = new ViewBox({
      width: vw,
      height: vh,
      transformOrigin: center,
      useDecompose: false,
    });

    const update = () => {
      updateMatrix(viewBox.toCSS());
    };

    var gui = new dat.gui.GUI();

    gui.add(setting, "x", -vw, vw, 1).onChange((value: number) => {
      // 模拟交互偏移
      const delta = value - lastX;

      lastX = value;

      viewBox.translateX(delta);

      update();
    });
    gui.add(setting, "y", -vh, vh, 1).onChange((value: number) => {
      // 模拟交互偏移
      const delta = value - lastY;

      lastY = value;

      viewBox.translateY(delta);

      update();
    });
    gui.add(setting, "zoom", 0.1, 50, 0.1).onChange((value: number) => {
      viewBox.setZoom(value, setting.cx, setting.cy);
      update();
    });
    gui.add(setting, "rotation", 0, 360, 1).onChange((value: number) => {
      viewBox.setRotation(value, setting.cx, setting.cy);
      update();
    });

    gui.add(setting, "skewX", -90, 90, 1).onChange((value: number) => {
      viewBox.setSkewX(value, setting.cx, setting.cy);

      update();
    });

    gui.add(setting, "skewY", -90, 90, 1).onChange((value: number) => {
      viewBox.setSkewY(value, setting.cx, setting.cy);

      update();
    });

    gui.add(setting, "flipX").onChange(() => {
      viewBox.flipX(setting.cx, setting.cy);
      update();
    });
    gui.add(setting, "flipY").onChange(() => {
      viewBox.flipY(setting.cx, setting.cy);
      update();
    });

    gui.add(setting, "zoomToFit").onChange(() => {
      viewBox.zoomToRect({
        x: rect.left,
        y: rect.top,
        ...rect,
      });
      update();
    });

    const folder1 = gui.addFolder("transform center");
    folder1.add(setting, "cx", 0, vw, 1).onChange((value: number) => {
      setCenter({
        x: setting.cx,
        y: setting.cy,
      });
      viewBox.setTransformOrigin(setting.cx, setting.cy);
    });
    folder1.add(setting, "cy", 0, vh, 1).onChange((value: number) => {
      setCenter({
        x: setting.cx,
        y: setting.cy,
      });
      viewBox.setTransformOrigin(setting.cx, setting.cy);
    });
  }, []);

  return (
    <div className="App">
      <div
        className="viewbox"
        style={{
          position: "relative",
          width: vw,
          height: vh,
          overflow: "hidden",
        }}
      >
        <div
          className="content"
          style={{
            transformOrigin: "0 0",
            transform: matrix,
          }}
        >
          <img width={vw} height={vh} src={bg} />
          <div
            style={{
              position: "absolute",
              ...rect,
              opacity: 0.3,
              backgroundColor: "red",
            }}
          ></div>
        </div>
        <div
          style={{
            zIndex: 9,
            position: "absolute",
            left: center.x - 3,
            top: center.y - 3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            opacity: 0.9,
            background: "red",
          }}
        ></div>
      </div>
      <div>{matrix}</div>
    </div>
  );
}
