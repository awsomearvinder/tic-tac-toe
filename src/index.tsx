import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

enum Player {
  Player1,
  Player2,
}

interface SquareProps {
  value?: Player;
  onClick: Function;
}

class Square extends React.Component<SquareProps> {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value === undefined
          ? "_"
          : this.props.value === Player.Player1
          ? "X"
          : "O"}
      </button>
    );
  }
}

interface BoardState {
  contents: Array<Player>;
  turn: Player;
}
class Board extends React.Component<{}, BoardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      contents: Array(9).fill(undefined),
      turn: Player.Player1,
    };
  }

  renderSquare(i: number) {
    return (
      <Square
        value={this.state.contents[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  handleClick(i: number) {
    //If a square has already been clicked, do nothing. player must choose something else.
    if (this.state.contents[i] !== undefined) return;

    const currentPlayer = this.state.turn;

    const nextTurn =
      this.state.turn === Player.Player1 ? Player.Player2 : Player.Player1;

    const contents = [...this.state.contents];
    contents[i] = currentPlayer;

    const didWin = () => {
      if (this.checkIfWin()) {
        const winner = currentPlayer === Player.Player1 ? "Player1" : "Player2";
        console.log(`guess who won? ${winner} did!`);
      }
    };

    this.setState({ contents, turn: nextTurn }, didWin);
  }

  /** This function returns true if there's a winner, false otherwise. */
  checkIfWin(): boolean {
    return (
      this.checkRowForWin() ||
      this.checkColForWin() ||
      this.checkDiagnolForWin()
    );
  }

  isEqual = (val: Player, _: any, arr: Player[]) =>
    val === arr[0] && arr[0] !== undefined;

  checkRowForWin(): boolean {
    let row = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        row.push(this.state.contents[3 * i + j]);
      }
      //if all items are equal to the first item in the array, they must be equal.
      if (row.every(this.isEqual)) return true;
      row = [];
    }
    return false;
  }
  checkColForWin(): boolean {
    let row = [];
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        row.push(this.state.contents[3 * i + j]);
      }
      //if all items are equal to the first item in the array, they must be equal.
      if (row.every(this.isEqual)) return true;
      row = [];
    }
    return false;
  }
  checkDiagnolForWin(): boolean {
    //check first diagnol
    let row = [];
    for (let i = 0; i < 3; i++) {
      row.push(this.state.contents[3 * i + i]);
    }
    if (row.every(this.isEqual)) return true;

    row = [];
    for (let i = 0; i < 3; i++) {
      row.push(this.state.contents[6 - i * 2]); //2 4 6
      //row.push(this.state.contents[3 * i - i]); //2 4 6
    }
    if (row.every(this.isEqual)) return true;
    return false;
  }

  render() {
    const status = `Next player: ${
      this.state.turn === Player.Player1 ? "X" : "O"
    }`;
    //if it's the current players turn and the game has ended - the last player must of won.
    const winner = this.state.turn === Player.Player1 ? "Player2" : "Player1";

    return (
      <div>
        <div className="status">
          {this.checkIfWin() ? `${winner} wins!` : status}
        </div>
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

ReactDOM.render(<Game />, document.getElementById("root"));
