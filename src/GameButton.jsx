export default function GameButton({id, onClick, selectedAnswer, winningClass="empty"}){
  return(
    <button className={`gameButton color-${selectedAnswer} ${winningClass}`} id={id} onClick={onClick}>{selectedAnswer}</button>
  );
}