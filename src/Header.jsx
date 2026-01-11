import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Header({isRunning, startGame, message, winMsg, howManyPieces, howManyColors, setHowManyColors, setHowManyPieces}){
  let value;
  let animationToDisplay=<div></div>;
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

    <div className='instructions'>
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