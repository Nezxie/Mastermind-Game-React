import { useState, useEffect } from 'react'
import './App.css'
import GameInput from './GameInput.jsx'
import GameBoard from './GameBoard.jsx'
import Header from './Header.jsx'
import GameHistoryItem from './GameHistoryItem.jsx'

/* Functions used:
 - newWinningSequence - generates an array of numbers that the user shall recreate in order to win
 - checkWin - checks if the user input is correct or wrong, 
    creates a new history entry array filled with {input , iscorrect} values
 - triggerWin - stops the game and sets the status + message to win or lose
 - startGame - starts the game by setting some state values + triggering the useEffect
 - clickGameButton - changes singular button color
 - onPlay - sends a new user inputed string as an answer to be checked for win conditions and recorded in history of moves
*/

export default function Game() {

  //user input made permanent
  const [howManyPieces, setHowManyPieces]=useState(5);
  const [howManyColors, setHowManyColors]=useState(5); //no more than 10, they are styled up to 10 right now
  const [history,setHistory]=useState(
  Array.from({ length: 10 }, () =>
  Array.from({ length: howManyPieces }, () => ({
    value: null,
    status: "empty"
  })))
  );

  //user input state
  const [userhowManyPieces, setuserHowManyPieces]=useState(5);
  const [userhowManyColors, setuserHowManyColors]=useState(5); //no more than 10, they are styled up to 10 right now
  const [currentMove,setCurrentMove]=useState(Array(howManyPieces).fill(null))
  

  //other game controls
  const [isGameRunning,setIsGameRunning] = useState(false);
  const [triesCounter, setTriesCounter]=useState(0);
  const [winningSequence, setWinningSequence]=useState([0,0,0,0,0]);

  //ui messages [probably could be reduced to 1 state]
  const [controlMessage, setControlMessage]=useState("Click on the Start button to begin.");
  const [winLoseStatus,setWinLoseStatus]=useState({status:"", winSequence:<></>});

  let gameBoardView;
  if(isGameRunning){
    gameBoardView = <div className='playArea'><div className='playerInput'>
          <GameInput clickHandle={clickGameButton} selectedAnswer={currentMove}/>
          <button onClick={onPlay}>Save answer</button>
        </div>
        <GameBoard history={history}/></div>
  }

  useEffect(() => {
      if (!isGameRunning) return;

      let winCode = newWinningSequence(howManyColors, howManyPieces);
      setWinningSequence(winCode);
      setHistory(
      Array.from({ length: 10 }, () =>
      Array.from({ length: howManyPieces }, () => ({
        value: null,
        status: "empty"
      })))
      );
      setCurrentMove(Array(howManyPieces).fill(null));
  }, [isGameRunning, howManyPieces, howManyColors]);


  function newWinningSequence(howManyColors, howManyPieces){
    let max=howManyColors;
    let min=0;
    let sequence = Array(howManyPieces).fill(null);
    for(let i=0;i<howManyPieces;i++){
      sequence[i]=Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return sequence;
  }

  function checkWin(winningSequence ,currentMove){
    const result = currentMove.map((elem, index)=>{
      if(elem == winningSequence[index]){
        return "correct";
      }
      else if(winningSequence.includes(elem)){
        return "wrong-position";
      }
      else{
        return "wrong";
      }
    });
    return result;
  }
  
  function triggerWin(isWin,winningRow){
    setIsGameRunning(false);
    if(isWin){
      let winSequence = 
        <div className='gameBoardHistory winningSequence'>
          <GameHistoryItem count={howManyPieces} selectedAnswer={winningRow}/>
        </div>;
      setWinLoseStatus({status:"win",winSequence:winSequence});
    }
    else{
      setWinLoseStatus({status:"lose", winSequence:<></>});
      setControlMessage("You lose, try again!")
    }
    return;
  }

/* functions triggered by user input */

function startGame(){
    setControlMessage(`You have 10 more tries`);
    setWinLoseStatus({status:"", winSequence:<></>})
    setHowManyPieces(userhowManyPieces);
    setHowManyColors(userhowManyColors);
    setTriesCounter(0);
    setIsGameRunning(true);
  }

  function clickGameButton(id){
    let newMove = [...currentMove];
    if(newMove[id]>howManyColors-1||newMove[id]==null){
      newMove[id]=0;
    }
    else{
      newMove[id]=newMove[id]+1;
    }
    setCurrentMove(newMove);
  }

  function onPlay(){
    if(currentMove.every(elem => elem == null)){
      return;
    }
    if(triesCounter<9){
      let statuses = checkWin(winningSequence,currentMove);
      let newMove = currentMove.map((value, index) => ({ value, status: statuses[index] }));
      if(statuses.length === howManyPieces && statuses.every(value => value === "correct")){
        setControlMessage(`You won in ${triesCounter+1} moves!`);
        triggerWin(true,newMove);
        return;
      }
      else{
        setControlMessage(`You have ${9-triesCounter} more tries`);
      }
      let newHistory =[...history];
      newHistory[triesCounter]=newMove;
      setHistory(newHistory);
      setCurrentMove(Array(howManyPieces).fill(null));
      setTriesCounter(triesCounter+1);
    }
    else{
      triggerWin(false);
    }
  }
  
  return (
    <>
      <Header isRunning={isGameRunning} startGame={startGame} message={controlMessage} winMsg={winLoseStatus.status} howManyPieces={userhowManyPieces} howManyColors={userhowManyColors} setHowManyColors={setuserHowManyColors} setHowManyPieces={setuserHowManyPieces}/>
      {gameBoardView}
      {winLoseStatus.winSequence}
    </>
  )
}