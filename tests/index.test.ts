import { ViewBox } from "../src";
describe("ViewBox", () => {
  it("zoom 2", () => {
    const viewBox = new ViewBox({
      width: 400,
      height: 400,
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
      width: 400,
      height: 400,
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(2);

    viewBox.setZoom(4);

    const mtx = viewBox.getMatrix();

    expect([viewBox.x, viewBox.y]).toEqual([-600, -600]);
  });

  it("zoom 2 to 4 - 2", () => {
    const viewBox = new ViewBox({
      width: 400,
      height: 400,
      transformOrigin: {
        x: 200,
        y: 200,
      },
    });

    viewBox.setZoom(2, 0, 0);

    viewBox.setZoom(4);

    expect([viewBox.x, viewBox.y]).toEqual([-200, -200]);
  });
});
