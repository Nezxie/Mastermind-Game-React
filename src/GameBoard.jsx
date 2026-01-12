import GameHistoryItem from "./GameHistoryItem.jsx";

export default function GameBoard({history}){
  return(
    <div className='gameBoardHistory'>{
      history.map((row, index)=>(
        <GameHistoryItem key={index} count={row.length} selectedAnswer={row}/>
      ))
    }</div>
  );
  }