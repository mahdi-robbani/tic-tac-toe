import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {

//     render() {
//       return (
//         <button 
//             className="square" 
//             onClick={() => this.props.onClick() }
//         >
//           {this.props.value} 
//         </button>
//       ); //why?
//     }
//   }


// User a function instead of extending React.Component since we only 
// need to render a button and nothing else
function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );// onClick={() => this.props.onClick() } becomes onClick={props.onClick}
}
  
  class Board extends React.Component {
    constructor(props){
          super(props); // In React all child classes that use a constructor must use super(properties)
          this.state = {
              squares: Array(9).fill(null),
              x: true,
            };
      }

    handleClick(i) {
        const squares = this.state.squares.slice(); // slice creates a copy of the array
        if (calculateWinner(squares) || squares[i]){
          return; // do nothing if a winner is found or if square already has symbol
        }
        squares[i] = this.state.x ? 'X' : 'O'; // ternary operator
        console.log(this.state.x)
        this.setState(
            {squares: squares,
             x: !this.state.x,
            });
    }

    renderSquare(i) {
      return (<Square 
                value={this.state.squares[i]} 
                onClick={() => this.handleClick(i)}/>);
    }
  
    render() {
      // Declare winner if present or else display turn
      const winner = calculateWinner(this.state.squares);
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.x ? 'X': 'O');
      }
  
      return (
        <div>
          <div className="status">{status}</div>
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
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  

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