import GameHistoryItem from "./GameHistoryItem.jsx";

export default function GameBoard({history}){
  return(
    <div className='gameBoardHistory'>{
      history.map((row)=>(
        <GameHistoryItem count={row.length} selectedAnswer={row}/>
      ))
    }</div>
  );
  }