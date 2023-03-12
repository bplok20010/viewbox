import { ViewBox } from "../src";

function toArray(matrix, s = 6) {
  return {
    a: matrix.a.toFixed(s),
    b: matrix.b.toFixed(s),
    c: matrix.c.toFixed(s),
    d: matrix.d.toFixed(s),
    tx: matrix.tx.toFixed(s),
    ty: matrix.ty.toFixed(s),
  };
}

function fixedObject(obj, s = 6) {
  const o = {};
  Object.keys(obj).forEach((key) => {
    o[key] = obj[key].toFixed(s);
  });

  return o;
}

describe("ViewBox", () => {
  it("zoom 2", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(2);

    expect([viewBox.x, viewBox.y]).toEqual([-200, -200]);
  });

  it("zoom 2 to 4 - 1", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(2);

    viewBox.setZoom(4);

    const mtx = viewBox.getMatrixObject();

    expect([viewBox.x, viewBox.y]).toEqual([-600, -600]);
  });

  it("zoom 2 to 4 - 2", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(2, 0, 0);

    viewBox.setZoom(4);

    expect([viewBox.x, viewBox.y]).toEqual([-200, -200]);
  });

  it("rotate-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(30);
    viewBox.setZoom(2);

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 1.7320508075688774,
        b: 0.9999999999999999,
        c: -0.9999999999999999,
        d: 1.7320508075688774,
        tx: 53.589838486224465,
        ty: -346.41016151377556,
      })
    );
  });

  it("scale-rotate-1000l", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(0.5);

    for (let i = 0; i < 2000; i++) {
      viewBox.setRotation(i);
    }

    viewBox.setRotation(50);

    expect({
      x: viewBox.x.toFixed(4),
      y: viewBox.y.toFixed(4),
    }).toEqual({
      x: "212.3257",
      y: "59.1168",
    });
  });

  it("scale-rotate-flipX-1000loop", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipX();

    for (let i = 0; i < 2000; i++) {
      viewBox.flipX();
    }

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 0.4414737964294635,
        b: -0.2347357813929454,
        c: -0.2347357813929454,
        d: -0.4414737964294635,
        tx: 158.6523969926964,
        ty: 335.2419155644818,
      })
    );
  });

  it("scale-rotate-flipY-1000loop", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipY();

    for (let i = 0; i < 2000; i++) {
      viewBox.flipY();
    }

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: -0.4414737964294635,
        b: 0.2347357813929454,
        c: 0.2347357813929454,
        d: 0.4414737964294635,
        tx: 241.3476030073036,
        ty: 64.75808443551821,
      })
    );
  });

  it("scale-rotate-flipXY", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipX();
    viewBox.flipY();

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: -0.4414737964294635,
        b: -0.2347357813929454,
        c: 0.2347357813929454,
        d: -0.4414737964294635,
        tx: 241.3476030073036,
        ty: 335.2419155644818,
      })
    );
  });

  it("scale-rotate-flipXY-1000loop", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipX();
    viewBox.flipY();

    for (let i = 0; i < 2000; i++) {
      viewBox.flipY();
      viewBox.flipX();
    }

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: -0.4414737964294635,
        b: -0.2347357813929454,
        c: 0.2347357813929454,
        d: -0.4414737964294635,
        tx: 241.3476030073036,
        ty: 335.2419155644818,
      })
    );
  });

  it("rotate-scale-flipX", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipX();

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 0.4414737964294635,
        b: -0.2347357813929454,
        c: -0.2347357813929454,
        d: -0.4414737964294635,
        tx: 158.6523969926964,
        ty: 335.2419155644818,
      })
    );
  });
  it("flipX-rotate-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipX();

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 0.4414737964294635,
        b: -0.2347357813929454,
        c: -0.2347357813929454,
        d: -0.4414737964294635,
        tx: 158.6523969926964,
        ty: 335.2419155644818,
      })
    );
  });

  it("rotate-flipX-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipX();

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 0.4414737964294635,
        b: -0.2347357813929454,
        c: -0.2347357813929454,
        d: -0.4414737964294635,
        tx: 158.6523969926964,
        ty: 335.2419155644818,
      })
    );
  });

  it("rotate-scale-flipY", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipY();

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: -0.4414737964294635,
        b: 0.2347357813929454,
        c: 0.2347357813929454,
        d: 0.4414737964294635,
        tx: 241.3476030073036,
        ty: 64.75808443551821,
      })
    );
  });

  it("rotate-flipY-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.flipY();
    viewBox.setZoom(0.5);

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: -0.4414737964294635,
        b: 0.2347357813929454,
        c: 0.2347357813929454,
        d: 0.4414737964294635,
        tx: 241.3476030073036,
        ty: 64.75808443551821,
      })
    );
  });

  it("flipY-rotate-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.flipY();
    viewBox.rotate(28);
    viewBox.setZoom(0.5);

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: -0.4414737964294635,
        b: -0.2347357813929454,
        c: -0.2347357813929454,
        d: 0.4414737964294635,
        tx: 335.2419155644818,
        ty: 158.65239699269637,
      })
    );
  });

  it("scale-rotate", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(2);
    viewBox.rotate(30);

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 1.7320508075688774,
        b: 0.9999999999999999,
        c: -0.9999999999999999,
        d: 1.7320508075688774,
        tx: 53.589838486224465,
        ty: -346.4101615137755,
      })
    );
  });

  it("scale-rotate-transformOrigin-scale-rotate", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 300,
        y: 200,
      },
    });

    viewBox.setZoom(2);
    viewBox.rotate(30);
    viewBox.setTransformOrigin(100, 100);
    viewBox.setZoom(0.5);
    viewBox.rotate(10);

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 0.38302222155948906,
        b: 0.3213938048432696,
        c: -0.3213938048432696,
        d: 0.38302222155948906,
        tx: 94.27127770974435,
        ty: -39.719983056226965,
      })
    );
  });

  it("translate-scale-rotate", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 300,
        y: 200,
      },
    });

    viewBox.translate(100, 100);
    viewBox.setZoom(2);
    viewBox.rotate(30);

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 1.7320508075688774,
        b: 0.9999999999999999,
        c: -0.9999999999999999,
        d: 1.7320508075688774,
        tx: 53.589838486224494,
        ty: -173.2050807568877,
      })
    );
  });
  it("translate-scale-rotate-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 300,
        y: 200,
      },
    });

    viewBox.translate(100, 100);
    viewBox.setZoom(2);
    viewBox.rotate(30);
    viewBox.setZoom(0.5);

    expect(toArray(viewBox.getMatrixObject())).toEqual(
      fixedObject({
        a: 0.43301270189221935,
        b: 0.24999999999999997,
        c: -0.24999999999999997,
        d: 0.43301270189221935,
        tx: 238.39745962155612,
        ty: 106.69872981077808,
      })
    );
  });

  it("zoom-to-rect", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 300,
        y: 200,
      },
    });

    viewBox.translate(100, 100);
    viewBox.setZoom(2);
    viewBox.rotate(30);
    viewBox.setZoom(0.5);
    viewBox.zoomToRect(
      {
        x: 440,
        y: 240,
        width: 70,
        height: 80,
      },
      {
        size: {
          width: 600,
          height: 400,
        },
      }
    );

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "2.165064",
      b: "1.250000",
      c: "-1.250000",
      d: "2.165064",
      tx: "-883.012702",
      ty: "-666.506351",
    });
  });

  it("zoom-to-rect-transformOrigin", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 0,
        y: 200,
      },
    });

    viewBox.zoomToRect(
      {
        x: 440,
        y: 240,
        width: 70,
        height: 80,
      },
      {
        size: {
          width: 600,
          height: 400,
        },
      }
    );

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "5.000000",
      b: "0.000000",
      c: "0.000000",
      d: "5.000000",
      tx: "-2375.000000",
      ty: "-1200.000000",
    });
  });

  it("rotate-scale-1000", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(97);
    viewBox.setZoom(1);

    for (let i = 0; i < 2000; i++) {
      viewBox.setZoom(i % 10 || 1);
    }

    viewBox.setZoom(1);

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "-0.121869",
      b: "0.992546",
      c: "-0.992546",
      d: "-0.121869",
      tx: "422.883099",
      ty: "25.864638",
    });
  });

  it("object-fit-contain-1", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 0,
      y: 0,
      width: 1200,
      height: 1200,
    };

    viewBox.zoomToFit(docRect, {
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.500000",
      b: "0.000000",
      c: "0.000000",
      d: "0.500000",
      tx: "0.000000",
      ty: "0.000000",
    });

    viewBox.zoomToFit(docRect, {
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.250000",
      b: "0.000000",
      c: "0.000000",
      d: "0.250000",
      tx: "0.000000",
      ty: "0.000000",
    });

    viewBox.zoomToFit(docRect, {
      viewBoxSize,
      matrix: [1, 0, 0, 1, 0, 0],
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.500000",
      b: "0.000000",
      c: "0.000000",
      d: "0.500000",
      tx: "0.000000",
      ty: "0.000000",
    });
  });

  it("object-fit-contain-2", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 0,
      y: 0,
      width: 800,
      height: 1200,
    };

    viewBox.zoomToFit(docRect, {
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.500000",
      b: "0.000000",
      c: "0.000000",
      d: "0.500000",
      tx: "100.000000",
      ty: "0.000000",
    });

    viewBox.zoomToFit(docRect, {
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.250000",
      b: "0.000000",
      c: "0.000000",
      d: "0.250000",
      tx: "150.000000",
      ty: "0.000000",
    });

    viewBox.zoomToFit(docRect, {
      viewBoxSize,
      matrix: [1, 0, 0, 1, 0, 0],
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.500000",
      b: "0.000000",
      c: "0.000000",
      d: "0.500000",
      tx: "100.000000",
      ty: "0.000000",
    });
  });

  it("object-fit-fill- 1", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 0,
      y: 0,
      width: 800,
      height: 1200,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "fill",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.750000",
      b: "0.000000",
      c: "0.000000",
      d: "0.500000",
      tx: "0.000000",
      ty: "0.000000",
    });
  });

  it("object-fit-fill-2", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "fill",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "1.500000",
      b: "0.000000",
      c: "0.000000",
      d: "2.000000",
      tx: "-150.000000",
      ty: "-200.000000",
    });
  });

  it("object-fit-cover- 1", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 0,
      y: 0,
      width: 800,
      height: 1200,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "cover",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.750000",
      b: "0.000000",
      c: "0.000000",
      d: "0.750000",
      tx: "0.000000",
      ty: "-150.000000",
    });
  });

  it("object-fit-cover-2", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "cover",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "2.000000",
      b: "0.000000",
      c: "0.000000",
      d: "2.000000",
      tx: "-300.000000",
      ty: "-200.000000",
    });
  });

  it("object-fit-none- 1", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 0,
      y: 0,
      width: 800,
      height: 1200,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "none",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "1.000000",
      b: "0.000000",
      c: "0.000000",
      d: "1.000000",
      tx: "-100.000000",
      ty: "-300.000000",
    });
  });

  it("object-fit-none-2", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "none",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "1.000000",
      b: "0.000000",
      c: "0.000000",
      d: "1.000000",
      tx: "0.000000",
      ty: "50.000000",
    });
  });

  it("object-fit-scale-down- 1", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 0,
      y: 0,
      width: 800,
      height: 1200,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "scale-down",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "0.500000",
      b: "0.000000",
      c: "0.000000",
      d: "0.500000",
      tx: "100.000000",
      ty: "0.000000",
    });
  });

  it("object-fit-scale-down-2", () => {
    const viewBox = new ViewBox();

    const viewBoxSize = {
      width: 600,
      height: 600,
    };
    const docRect = {
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    };

    viewBox.zoomToFit(docRect, {
      objectFit: "scale-down",
      viewBoxSize,
    });

    expect(toArray(viewBox.getMatrixObject())).toEqual({
      a: "1.000000",
      b: "0.000000",
      c: "0.000000",
      d: "1.000000",
      tx: "0.000000",
      ty: "50.000000",
    });
  });
});
