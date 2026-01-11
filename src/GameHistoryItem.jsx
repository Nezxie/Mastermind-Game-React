import GameButton from "./GameButton.jsx";

export default function GameHistoryItem({selectedAnswer}){
  return(
   <div className='gameInput'>
      {
      Array.from({ length: selectedAnswer.length }).map((_, index) => (
        <GameButton
          selectedAnswer ={selectedAnswer[index].value}
          winningClass = {selectedAnswer[index].status}
          key={index}
          id={index}
        />
      ))}   
    </div>

  );
}
