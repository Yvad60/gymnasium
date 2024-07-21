import Explosion from "react-canvas-confetti/dist/presets/realistic";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const App = () => {
  return (
    <main style={{ minHeight: "800px" }}>
      <Explosion
        autorun={{ speed: 0.5 }}
        decorateOptions={() => ({
          // angle: randomInRange(-160, -140),
          spread: randomInRange(80, 100),
          particleCount: randomInRange(50, 80),
          origin: { y: 0.7 },
          colors: ["ff000D", "0ADD08", "FFE135", "b5651d", "5729CE", "0165fc"],
          shapes: ["circle", "square"],
        })}
      />
    </main>
  );
};
export default App;
