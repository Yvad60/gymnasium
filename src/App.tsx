import { useState } from "react";
import Explosion from "react-canvas-confetti/dist/presets/realistic";

const App = () => {
  const [hasLaunched, setHasLaunched] = useState(false);

  return (
    <div>
      <button onClick={() => setHasLaunched(true)}>Launch confetti</button>
      {hasLaunched && <Explosion autorun={{ speed: 0.5 }} />}
    </div>
  );
};
export default App;
