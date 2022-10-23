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

    expect([viewBox.clone().x, viewBox.clone().y]).toEqual([-200, -200]);
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

    const mtx = viewBox.clone().getMatrixObject();

    expect([viewBox.clone().x, viewBox.clone().y]).toEqual([-600, -600]);
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

    expect([viewBox.clone().x, viewBox.clone().y]).toEqual([-200, -200]);
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

  it("rotate-flipY-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipY();

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

  it("flipY-rotate-scale", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.rotate(28);
    viewBox.setZoom(0.5);
    viewBox.flipY();

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

  it("scale-rotate", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(2);
    viewBox.rotate(30);

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
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
    viewBox.zoomToRect({
      x: 440,
      y: 240,
      width: 70,
      height: 80,
    });

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
      fixedObject({
        a: 4.330127018922194,
        b: 2.4999999999999996,
        c: -2.4999999999999996,
        d: 4.330127018922194,
        tx: -1056.8103339880427,
        ty: -2199.9355652982135,
      })
    );
  });

  it("zoom-to-rect-transformOrigin", () => {
    const viewBox = new ViewBox({
      transformOrigin: {
        x: 0,
        y: 200,
      },
    });

    viewBox.zoomToRect({
      x: 440,
      y: 240,
      width: 70,
      height: 80,
    });

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual(
      fixedObject({
        a: 5,
        b: 0,
        c: 0,
        d: 5,
        tx: -2375,
        ty: -1200,
      })
    );
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

    expect(toArray(viewBox.clone().getMatrixObject())).toEqual({
      a: "-0.121869",
      b: "0.992546",
      c: "-0.992546",
      d: "-0.121869",
      tx: "422.883099",
      ty: "25.864638",
    });
  });
});
