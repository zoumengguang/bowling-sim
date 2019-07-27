import React, { Component } from "react";

class Simulator extends Component {
  state = {
    curFrame: 1,
    lastBowl: 10,
    timesBowled: 0,
    score: {
      one: [],
      two: [],
      three: [],
      four: [],
      five: [],
      six: [],
      seven: [],
      eight: [],
      nine: [],
      ten: []
    }
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

  // Generate bowl
  getBowl = () => {
    const { curFrame, lastBowl, timesBowled, simId, score } = this.state;
    const scoreArr = this.getScoreArr(curFrame);

    // If frame is greater than 10, terminate interval
    if (curFrame > 10) {
      clearInterval(simId);
    }

    // Else calculate the bowl
    let min = 0;
    let max = lastBowl + 1;
    let bowl = Math.floor(Math.random() * (max - min)) + min;

    if (curFrame === 10 && timesBowled < 3 && bowl === 10) {
      scoreArr.push("X");
      clearInterval(simId);
      this.setState({ curFrame: curFrame + 1, lastBowl: 10, timesBowled: 0 });
    } else if (curFrame === 10 && timesBowled < 3 && bowl != 10) {
      scoreArr.push(bowl.toString());
    }
  };

  // Algorithm for calculating a number within a range
  // The maximum is exclusive and the minimum is inclusive
  /*  getBowl = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }; */

  // Helper function for retrieving score for current frame
  getScoreArr = curFrame => {
    const { score } = this.state;

    switch (curFrame) {
      case 10:
        return score.ten;
      case 9:
        return score.nine;
      case 8:
        return score.eight;
      case 7:
        return score.seven;
      case 6:
        return score.six;
      case 5:
        return score.five;
      case 4:
        return score.four;
      case 3:
        return score.three;
      case 2:
        return score.two;
      case 1:
        return score.one;
    }
  };

  render() {
    const { score, curFrame } = this.state;

    return (
      <table>
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
        </tr>
      </table>
    );
  }
}

export default Simulator;
