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
            className={this.props.className}
            onClick={() => this.props.onClick() }
            winner={this.props.winner}
        >
          {this.props.value} 
        </button>
      );
    }
  }

  class Board extends React.Component {

    renderSquare(i, className) {
      return (<Square
                className={className}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                />);
    }
  
    render() {
      const numRows = 3;
      const numCols = 3;
      let rows = [];

      for (let i = 0; i < numRows; i++){
        // create div with rows
        let cols = [];
        for (let j = 0; j < numCols; j++){
          let className = "square"
          const nodeNum = 3*i + j;
          // check if winning tiles exist and if they include our node
          // then change the class name to square win
          if (this.props.winnerTiles){
            if (this.props.winnerTiles.includes(nodeNum)){
              className += " win"
            }
          }
          cols.push(<React.Fragment key={(nodeNum)}>
                      {this.renderSquare(nodeNum, className)}
                    </React.Fragment>)
        }
        // add each row to list of rows
        rows.push(<div className="board-row" key={i}>
                    {cols}
                  </div>)
      } 

      return (
        <div>
          {rows}
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
            lastClicked: null,
            move: 0,
          }],
          stepNumber: 0,
          x: true,
          ascending: true,
        }
    }

  handleClick(i) {
    // Only keep history of steps N + 1
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice()
    if (calculateWinnerTiles(squares) || squares[i]){
      return; // do nothing if a winner is found or if square already has symbol
    }
    squares[i] = this.state.x ? 'X' : 'O'; // ternary operator
    this.setState({
      history: history.concat([{squares: squares,
                                lastClicked: i,
                                move: history.length,
                              }]), //history is a array of dictionatries. concat doesnt mutate original array
      stepNumber: history.length,
      x: !this.state.x,
      ascending: this.state.ascending,
    });
  }

    jumpTo(step) {
      this.setState({
        // even steps are true (x goes) and odd steps are false
        stepNumber: step,
        x: (step % 2) === 0,
      });
    }

    sortMoves(){
      this.setState({
        ascending: !this.state.ascending,
      })
    }

    render() {
      let history = this.state.history.slice();
      const current = history[this.state.stepNumber]; // Only render the Nth step
      // Get tile combo that determines winner
      const winnerTiles = calculateWinnerTiles(current.squares);
      // Get which symbol won
      const winner = winnerTiles ? current.squares[winnerTiles[0]] : null
      // reverse history to display the reserve sorted buttons
      if (!this.state.ascending){
        history = history.reverse()
      }
      let moves = history.map((step) => {
        // tile poisiton (i, j)
        const pos = [Math.floor(step.lastClicked/3), step.lastClicked % 3]
        // If no moves go to game start
        const desc = step.move ? `Go to move #${step.move} (${pos})`: 'Go to game start';
        // all list elements in react need a key
        return (
          <li key={step.move}>
            <button onClick={() => this.jumpTo(step.move)}>{desc}</button>
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
              winnerTiles={winnerTiles}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <div>
            <button onClick={() => this.sortMoves()}>Sort moves</button>
            </div>
            <ul>{ moves }</ul>
          </div>
        </div>
      );
    }
  }

// TO-DO:
// 1. Display the location for each move in the format (col, row) in the move history list. (DONE)
// 2. Bold the currently selected item in the move list. (NOT SURE)
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
  
  function calculateWinnerTiles(squares) {
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
        //console.log([a, b, c])
        return [a, b, c];
      }
    }
    return null;
  }