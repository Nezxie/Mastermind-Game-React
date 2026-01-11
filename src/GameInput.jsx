import GameButton from "./GameButton.jsx";

export default function GameInput({clickHandle, selectedAnswer}){
  return(
   <div className='gameInput'>
      {
      Array.from({ length: selectedAnswer.length }).map((_, index) => (
        <GameButton
          selectedAnswer ={selectedAnswer[index]}
          key={index}
          id={index}
          onClick = {()=>{clickHandle(index)}}
        />
      ))}   
    </div>

  );
}