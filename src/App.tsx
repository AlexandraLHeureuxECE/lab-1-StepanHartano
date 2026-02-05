import { useState } from 'react';
import './App.css';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  isWinningSquare: boolean;
}

function Square({ value, onSquareClick, isWinningSquare }: SquareProps) {
  return (
    <button 
      className={`square ${value ? 'taken' : ''} ${isWinningSquare ? 'winning' : ''} ${value}`} 
      onClick={onSquareClick}
      disabled={value !== null} 
    >
      {value}
    </button>
  );
}

// Logic: Calculate Winner AND Line
function calculateWinner(squares: Array<string | null>) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Board() {
  const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  
  // NEW: State for the Scoreboard
  const [scores, setScores] = useState({ xScore: 0, oScore: 0, draws: 0 });

  // Check for winner (used for display and preventing clicks)
  const winInfo = calculateWinner(squares);
  const winner = winInfo?.winner;
  const winningLine = winInfo?.line || [];
  const isDraw = !winner && squares.every(Boolean);

  function handleClick(i: number) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // Check if this move WON the game to update score immediately
    const result = calculateWinner(nextSquares);
    if (result) {
      if (result.winner === 'X') {
        setScores(prev => ({ ...prev, xScore: prev.xScore + 1 }));
      } else {
        setScores(prev => ({ ...prev, oScore: prev.oScore + 1 }));
      }
    } else if (!nextSquares.includes(null)) {
      // It's a draw
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    // Note: We do NOT reset scores here, so they persist between rounds!
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}!`;
  } else if (isDraw) {
    status = "It's a Draw!";
  } else {
    status = `Next Player: ${xIsNext ? "X" : "O"}`;
  }

  function renderSquare(i: number) {
    return (
      <Square 
        value={squares[i]} 
        onSquareClick={() => handleClick(i)}
        isWinningSquare={winningLine.includes(i)}
      />
    );
  }

  return (
    <>
      {/* NEW: Scoreboard Display */}
      <div className="scoreboard">
        <div className="score-item" style={{ color: '#61dafb' }}>
          <span className="score-label">Player X</span>
          <span className="score-value">{scores.xScore}</span>
        </div>
        <div className="score-item" style={{ color: '#ccc' }}>
          <span className="score-label">Draws</span>
          <span className="score-value">{scores.draws}</span>
        </div>
        <div className="score-item" style={{ color: '#ff6b6b' }}>
          <span className="score-label">Player O</span>
          <span className="score-value">{scores.oScore}</span>
        </div>
      </div>

      <div className="status">{status}</div>
      
      <div className="board-grid">
        <div className="board-row">
          {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
        </div>
      </div>
      
      <button className="reset-button" onClick={resetGame}>
        New Game
      </button>
    </>
  );
}

export default function Game() {
  return (
    <div className="game-container">
      <h1>TIC TAC TOE</h1>
      <Board />
    </div>
  );
}