export enum Player {
  Player1 = "PLAYER_ONE",
  Player2 = "PLAYER_TWO"
}

export interface CheckButton {
  checked: boolean
  checkedBy: Player | null
}

export interface GameState {
  hasSomeoneWon: boolean
  winner: Player | null
  isGameOver: boolean
}


