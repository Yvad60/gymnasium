import { CheckButton } from "../types"

export function hasSomeoneWon(gameButtons: CheckButton[]) : boolean{ 

  if (anyRowMatch(gameButtons)) return true
  if (anyColumnMatch(gameButtons)) return true
  if (anyDiagonalMatch(gameButtons)) return true
  return false
}

function anyRowMatch(gameButtons: CheckButton[]): boolean{
  const firstRow = gameButtons.slice(0,3)
  if (checkedBySamePlayer(firstRow)) return true

  const seconRow = gameButtons.slice(3, 6) 
  if (checkedBySamePlayer(seconRow)) return true

  const thirdRow = gameButtons.slice(6, 9)
  if (checkedBySamePlayer(thirdRow)) return true

  return false
}

function anyColumnMatch (gameButtons: CheckButton[]): boolean{
  const firstColumn = gameButtons.filter((_button, index) => index % 3 === 0)
  if (checkedBySamePlayer(firstColumn)) return true
  
  const secondColumn = gameButtons.filter((_button, index) => (index - 1) % 3 === 0)
  if (checkedBySamePlayer(secondColumn)) return true

  const thirdColumn = gameButtons.filter((_button, index) => (index - 2) % 3 === 0)
  if (checkedBySamePlayer(thirdColumn)) return true

  return false
}

function anyDiagonalMatch (gameButtons: CheckButton[]): boolean{
  const firstDiagonal = gameButtons.filter((_button, index) => index  % 4 === 0)
  if (checkedBySamePlayer(firstDiagonal)) return true

  const secondDiagonal = gameButtons.filter((_button, index) => index > 0 && (index % 2 === 0) && (index <= 6))
  if (checkedBySamePlayer(secondDiagonal)) return true
  
  return false
}

function checkedBySamePlayer(buttons: CheckButton[]){
  const player = buttons[0].checkedBy
  return(buttons.every(button => button.checked && button.checkedBy === player))
}
