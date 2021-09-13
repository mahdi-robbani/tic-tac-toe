import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// User a function instead of extending React.Component since we only 
// need to render a button and nothing else
// function Square(props){
//   return (
//     <button className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   );// onClick={() => this.props.onClick() } becomes onClick={props.onClick}
// }


class Square extends React.Component {

    render() {
      return (
        <button 
            className="square" 
            onClick={() => this.props.onClick() }
        >
          {this.props.value} 
        </button>
      ); //why?
    }
  }

  class Board extends React.Component {

    renderSquare(i) {
      return (<Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                />); //why dont I have to do this.props.history.squares
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props); // In React all child classes that use a constructor must use super(properties)
        this.state = {
          history: [{
            squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          x: true,
          lastClicked: null,
        }
    }

  handleClick(i) {
    // Only keep history of steps N + 1
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]){
      return; // do nothing if a winner is found or if square already has symbol
    }
    squares[i] = this.state.x ? 'X' : 'O'; // ternary operator
    this.setState({
      history: history.concat([{squares: squares,
                                lastClicked: i,
                              }]), //history is a array of dictionatries. concat doesnt mutate original array
      stepNumber: history.length,
      x: !this.state.x,
    });
  }

    jumpTo(step) {
      this.setState({
        // even steps are true (x goes) and odd steps are false
        stepNumber: step,
        x: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber]; // Only render the Nth step
      const winner = calculateWinner(current.squares);
      // step is the object (squares) and move is in the index
      const moves = history.map((step, move) => {
        // tile poisiton (i, j)
        const pos = [Math.floor(step.lastClicked/3), step.lastClicked % 3]
        // If no moves go to game start
        const desc = move ? `Go to move #${move} (${pos})`: 'Go to game start';
        // console.log("STEP: " + step.squares)
        // console.log("MOVE: " + move)
        // all list elements in react need a key
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner){
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player:' + (this.state.x ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <ul>{ moves }</ul>
          </div>
        </div>
      );
    }
  }

// TO-DO:
// 1. Display the location for each move in the format (col, row) in the move history list.
// 2. Bold the currently selected item in the move list.
// 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
// 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
// 5. When someone wins, highlight the three squares that caused the win.
// 6. When no one wins, display a message about the result being a draw.
// // The most basic thingyou can render
// class Game extends React.Component{
//     render(){
//         return (
//             <p>"Hello"</p>
//         );
//     }
// }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }