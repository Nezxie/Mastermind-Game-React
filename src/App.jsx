import { useState, useEffect } from 'react'
import './App.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Game() {
  let gameBoardView;
  const [userhowManyPieces, setuserHowManyPieces]=useState(5);
  const [userhowManyColors, setuserHowManyColors]=useState(5); //no more than 10, they are styled up to 10 right now
  const [howManyPieces, setHowManyPieces]=useState(5);
  const [howManyColors, setHowManyColors]=useState(5); //no more than 10, they are styled up to 10 right now
  const [isGameRunning,setIsGameRunning] = useState(false);
  const [controlMessage, setControlMessage]=useState("Click on the Start button to begin.");
  const [winLoseStatus,setWinLoseStatus]=useState("");
  const [history,setHistory]=useState(
  Array.from({ length: 10 }, () =>
  Array.from({ length: howManyPieces }, () => ({
    value: null,
    status: "empty"
  })))
  );
  const [currentMove,setCurrentMove]=useState(Array(howManyPieces).fill(null))
  const [triesCounter, setTriesCounter]=useState(0);
  const [winningSequence, setWinningSequence]=useState([0,0,0,0,0]);

  
  function newWinningSequence(howManyColors, howManyPieces){
    let max=howManyColors;
    let min=0;
    let sequence = Array(howManyPieces).fill(null);
    for(let i=0;i<howManyPieces;i++){
      sequence[i]=Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return sequence;
  }

  function startGame(){
    setControlMessage(`You have 10 more tries`);
    setHowManyPieces(userhowManyPieces);
    setHowManyColors(userhowManyColors);
    setTriesCounter(0);
    setIsGameRunning(true);
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

function triggerWin(isWin){
  setIsGameRunning(false);
  if(isWin){
    setWinLoseStatus("win");
  }
  else{
    setWinLoseStatus("lose");
    setControlMessage("You lose, try again!")
  }
  
  return;
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
        triggerWin(true);
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
if(isGameRunning){
gameBoardView = <div className='playArea'><div className='playerInput'>
          <GameInput clickHandle={clickGameButton} selectedAnswer={currentMove}/>
          <button onClick={onPlay}>Save answer</button>
        </div>
        <GameBoard history={history}/></div>
}
  return (
    <>
      <Header isRunning={isGameRunning} startGame={startGame} message={controlMessage} winMsg={winLoseStatus} howManyPieces={userhowManyPieces} howManyColors={userhowManyColors} setHowManyColors={setuserHowManyColors} setHowManyPieces={setuserHowManyPieces}/>
      {gameBoardView}
    </>
  )
}

function GameInput({clickHandle, selectedAnswer
}){
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

function GameButton({id, onClick, selectedAnswer, winningClass="empty"}){
  return(
    <button className={`gameButton color-${selectedAnswer} ${winningClass}`} id={id} onClick={onClick}>{selectedAnswer}</button>
  );
}

function GameBoard({history}){
  return(
    <div className='gameBoardHistory'>{
      history.map((row)=>(
        <GameHistoryItem count={row.length} selectedAnswer={row}/>
      ))
    }</div>
  );
  }
function GameHistoryItem({selectedAnswer}){
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

function Header({isRunning, startGame, message, winMsg, howManyPieces, howManyColors, setHowManyColors, setHowManyPieces}){
  let value;
  const animationWin=    <DotLottieReact
      src="https://lottie.host/30ad829e-f72d-4c70-8b7c-66ed4da7704a/RvIynea4K6.lottie"
      loop
      autoplay
    />;
  const animationLose=        <DotLottieReact
      src="https://lottie.host/cd382ae1-9270-4938-9e17-3506f352736c/PpYnSqUp0q.lottie"
      loop
      autoplay
    />
  let animationToDisplay=<div></div>;
  if(isRunning){
    value = <span className="material-symbols-outlined">refresh</span>;
  }
  else{
    value = "Start game";
    if(winMsg==="win"){
      animationToDisplay=animationWin;
    }
    else if(winMsg==="lose"){
      animationToDisplay=animationLose;
    }
    else{
      animationToDisplay=<div></div>;
    }
  }
  return(
    <div className='header'>
      <div className='title'>
      <h1>Mastermind 🧠</h1>
      <button onClick={startGame} className='funcButton'>{value}</button>
      </div>
      <div>
      <p>Try to guess the code in as little moves as you can. You can change colors by
         repeatedly clicking on the buttons. When you are ready click "Save answer" to check if you guessed correctly. You have 10 tries. 
         To reset the game click on the arrow button.</p>
         <p><span className='green-text'>Green </span> means correct guess on correct position</p>
         <p><span className='yellow-text'>Yellow</span> means correct guess on wrong position</p>
         <p>You can change the difficulty here, new settings will be applied after you start a new game.</p>
         <div className='difficulty-controls'>
          <div className="form-input">
          <label htmlFor="pieces-range">Pieces per row: {howManyPieces}</label>
            <input
              id="pieces-range"
              type="range"
              min="2"
              max="10"
              value={howManyPieces}
              onChange={e => setHowManyPieces(+e.target.value)}
                />
            </div>
            <div className="form-input">
            <label htmlFor="colors-range">Colors available: {howManyColors+1}</label>
            <input
              id="colors-range"
              type="range"
              min="1"
              max="9"
              value={howManyColors}
              onChange={e => setHowManyColors(+e.target.value)}
                />
              </div>
         </div>
      <p className='bold-text'>{message}</p>
      {animationToDisplay}
      </div>
    </div>
  );
}

