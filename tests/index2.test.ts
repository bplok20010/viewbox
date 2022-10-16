import { ViewBox } from "./ViewBox";
describe("ViewBox", () => {
  it("zoom 2", () => {
    const viewBox = new ViewBox({
      width: 400,
      height: 400,
    });

    viewBox.setZoom(2);

    expect([viewBox.x, viewBox.y]).toEqual([-200, -200]);
  });

  it("zoom 2 to 4 - 1", () => {
    const viewBox = new ViewBox({
      width: 400,
      height: 400,
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
    });

    viewBox.setZoom(2, {
      x: 0,
      y: 0,
    });

    viewBox.setZoom(4);

    const mtx = viewBox.getMatrix();

    expect([viewBox.x, viewBox.y]).toEqual([-400, -400]);
  });
});
