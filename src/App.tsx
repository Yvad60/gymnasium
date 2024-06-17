import { useState } from "react";
import { DrawLayer, ImageLayer, ShapeEditor, wrapShape } from "react-shape-editor";

function arrayReplace(arr, index, item) {
  return [
    ...arr.slice(0, index),
    ...(Array.isArray(item) ? item : [item]),
    ...arr.slice(index + 1),
  ];
}

const RectShape = wrapShape(({ width, height }) => (
  <rect width={width} height={height} fill="rgba(0,0,255,0.5)" />
));

let idIterator = 1;
const App = () => {
  const [items, setItems] = useState([]);

  console.log(items);

  const [{ vectorHeight, vectorWidth }, setVectorDimensions] = useState({
    vectorHeight: 0,
    vectorWidth: 0,
  });

  return (
    <div>
      <ShapeEditor vectorWidth={vectorWidth} vectorHeight={vectorHeight}>
        <ImageLayer
          // Photo by Sarah Gualtieri on Unsplash
          src="https://user-images.githubusercontent.com/4413963/70390894-a1880180-1a12-11ea-9901-e250d0f7bb2b.jpg"
          onLoad={({ naturalWidth, naturalHeight }) => {
            setVectorDimensions({
              vectorWidth: naturalWidth,
              vectorHeight: naturalHeight,
            });
          }}
        />
        <DrawLayer
          onAddShape={({ x, y, width, height }) => {
            setItems((currentItems) => [
              ...currentItems,
              { id: `id${idIterator}`, x, y, width, height },
            ]);
            idIterator += 1;
          }}
        />
        {items.map((item, index) => {
          const { id, height, width, x, y } = item;
          return (
            <RectShape
              key={id}
              shapeId={id}
              height={height}
              width={width}
              x={x}
              y={y}
              onChange={(newRect) => {
                setItems((currentItems) =>
                  arrayReplace(currentItems, index, {
                    ...item,
                    ...newRect,
                  })
                );
              }}
              onDelete={() => {
                setItems((currentItems) => arrayReplace(currentItems, index, []));
              }}
            />
          );
        })}
      </ShapeEditor>
    </div>
  );
};
export default App;
