import React, { Component } from "react";

class Simulator extends Component {
  state = {
    curFrame: 1,
    pinsLeft: 10,
    timesBowled: 0,
    curScore: 0,
    scoreboard: [[], [], [], [], [], [], [], [], [], []]
  };

  componentDidMount() {
    this.startBowl();
  }

  componentWillUnmount() {
    clearInterval(this.state.simId);
  }

  // Start the sim with a 1 sec interval between a bowl
  startBowl = () => {
    const simId = setInterval(() => {
      this.getBowl();
    }, 1000);
    this.setState({ ...this.state, simId: simId });
  };

  // Algorithm for calculating a number within a range
  // The maximum is exclusive and the minimum is inclusive
  /*  getBowl = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }; */

  // Generate bowl
  getBowl = () => {
    const { curFrame, pinsLeft, simId, timesBowled } = this.state;

    // If frame is greater than 10, terminate interval
    if (curFrame > 10) {
      clearInterval(simId);
      return;
    }

    // Else calculate the bowl
    let min = 0;
    let max = pinsLeft + 1;
    var bowl = Math.floor(Math.random() * (max - min)) + min;

    this.checkBowl(bowl);
  };

  /*
    List of vars
    curFrame: 1,
    pinsLeft: 10, Counts pins remaining on subsequent bowls past first on a frame
    timesBowled: 0, Number of times bowled in a frame
    strike: 2, Count remaining number of strike bonuses
    spare: false, Count if spare bonus
    curScore: current running score
    scoreboard: array of arrays, each individual array is a frame
  */

  /* checkStrikeOrSpare = bowl => {
    const { pinsLeft } = this.state;

    if (bowl === 10) {
      return "X";
    } else if (bowl === pinsLeft) {
      return "/";
    } else {
      return bowl;
    }
  }; */

  // Check the conditions and score the bowl
  checkBowl = bowl => {
    const { curFrame, timesBowled, pinsLeft, scoreboard } = this.state;
    let scoreArr = scoreboard;

    if (timesBowled > 0) {
      if (bowl === pinsLeft) {
        scoreArr[curFrame - 1].push("/");
        this.setState({
          ...this.state,
          curFrame: curFrame + 1,
          timesBowled: 0,
          pinsLeft: 10,
          scoreboard: scoreArr
        });
      } else if (bowl !== pinsLeft) {
        scoreArr[curFrame - 1].push(bowl.toString());
        this.setState({
          ...this.state,
          curFrame: curFrame + 1,
          timesBowled: 0,
          pinsLeft: 10,
          scoreboard: scoreArr
        });
      }
    } else if (timesBowled === 0) {
      if (bowl === 10) {
        scoreArr[curFrame - 1].push("X");
        this.setState({
          ...this.state,
          curFrame: curFrame + 1,
          timesBowled: 0,
          pinsLeft: 10,
          scoreboard: scoreArr
        });
      } else if (bowl < 10) {
        scoreArr[curFrame - 1].push(bowl.toString());
        this.setState({
          ...this.state,
          timesBowled: 1,
          pinsLeft: 10 - bowl,
          scoreboard: scoreArr
        });
      }
    }
  };

  render() {
    console.log(this.state);
    const { scoreboard } = this.state;

    return (
      <table>
        <tbody>
          <tr>
            <td>Frame</td>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
          </tr>
          <tr>
            <td>Score</td>
            <th>{scoreboard[0]}</th>
            <th>{scoreboard[1]}</th>
            <th>{scoreboard[2]}</th>
            <th>{scoreboard[3]}</th>
            <th>{scoreboard[4]}</th>
            <th>{scoreboard[5]}</th>
            <th>{scoreboard[6]}</th>
            <th>{scoreboard[7]}</th>
            <th>{scoreboard[8]}</th>
            <th>{scoreboard[9]}</th>
          </tr>
        </tbody>
      </table>
    );
  }
}
export default Simulator;
