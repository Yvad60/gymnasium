import { CheckButton, GameState } from "./types";

export const defaultCheckButton: CheckButton = {
  checked: false,
  checkedBy: null,
};

export const defaultGameState: GameState = {
  hasSomeoneWon: false,
  winner: null,
  isGameOver: false
};
