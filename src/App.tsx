import { useEffect, useState } from "react";
import { defaultCheckButton, defaultGameState } from "./constants";
import { hasSomeoneWon } from "./helpers";
import { CheckButton, GameState, Player } from "./types";

const App = () => {
  const checkButtons: CheckButton[] = Array(9).fill(defaultCheckButton);

  const [buttons, setButtons] = useState<CheckButton[]>(checkButtons);
  const [activePlayer, setActivePlayer] = useState<Player>(Player.Player1);

  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  const handleCheckButton = (btnIndex: number) => {
    setButtons((prev) =>
      prev.map((btn, index) => {
        if (index === btnIndex) return { ...btn, checked: true, checkedBy: activePlayer };
        return btn;
      })
    );

    if (activePlayer === Player.Player1) setActivePlayer(Player.Player2);
    else setActivePlayer(Player.Player1);
  };

  useEffect(() => {
    if (hasSomeoneWon(buttons))
      setGameState({
        hasSomeoneWon: true,
        winner: activePlayer === Player.Player1 ? Player.Player2 : Player.Player1, // 
        isGameOver: true,
      });
    if (buttons.every((button) => button.checked)) setGameState({ ...gameState, isGameOver: true });
  }, [buttons, activePlayer, gameState]);

  const gameOverMessage =
    gameState.winner === Player.Player1
      ? "Player 1 Wins"
      : gameState.winner === Player.Player2
      ? "Player 2 Wins"
      : "It's a draw";

  return (
    <main className="flex flex-col items-center min-h-screen text-gray-700">
      <h1 className="text-5xl font-medium mt-10">Tic Tac Toe</h1>
      <div className="w-full mt-20 grid grid-cols-3 grid-rows-3 max-w-lg min-h-[32rem] [&>*:nth-last-child(-n+3)]:border-b-0 [&>*:nth-child(3n)]:border-r-0">
        {buttons.map((button, index) => (
          <button
            disabled={button.checked || gameState.isGameOver}
            key={index}
            onClick={() => handleCheckButton(index)}
            className="flex items-center justify-center w-full border-b-8 border-r-8 border-gray-700"
          >
            {button.checked && button.checkedBy === Player.Player1 && (
              <span className="text-9xl font-light">x</span>
            )}
            {button.checked && button.checkedBy === Player.Player2 && (
              <span className="text-9xl font-light">o</span>
            )}
          </button>
        ))}
      </div>
      {gameState.isGameOver && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <h4 className="text-4xl font-medium">Game over</h4>
          <span className="text-2xl text-center">{gameOverMessage}</span>
        </div>
      )}
    </main>
  );
};
export default App;
