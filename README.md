# ViewBox

## Install

```sh
npm install @bplok20010/viewbox
```

## Usage

```ts
import { ViewBox } from "@bplok20010/viewbox";

const viewBox = new ViewBox({
  width: 800,
  height: 800,
});

viewBox.setZoom(2, 400, 400);

console.log(viewBox.toCSS());
```

## Dev

```
yarn

```
