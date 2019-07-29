import React, { Component } from "react";

class Simulator extends Component {
  /* List of vars
   * curFrame: 1, self explanatory
   * pinsLeft: 10, Counts pins remaining on subsequent bowls past first on a frame
   * timesBowled: 0, Number of times bowled in a frame
   * curScore: current running score
   * scoreboard: array of arrays, each individual array is a frame's score
   */

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
    }, 1);
    this.setState({ ...this.state, simId: simId });
  };

  // Generate bowl and check game end condition
  getBowl = () => {
    const { curFrame, pinsLeft, simId } = this.state;

    // If frame is greater than 10, terminate interval
    if (curFrame > 10) {
      clearInterval(simId);
      return;
    }

    // Else calculate the bowl
    // max is exclusive, min is inclusive
    let min = 0;
    let max = pinsLeft + 1;
    var bowl = Math.floor(Math.random() * (max - min)) + min;

    this.checkBowl(bowl);
  };

  // Check the conditions and score the bowl
  checkBowl = bowl => {
    const { curFrame, timesBowled, pinsLeft, scoreboard } = this.state;
    let scoreArr = scoreboard;

    // If subsequent bowl of the frame
    if (timesBowled > 0) {
      // Check for special 10th frame rules
      if (curFrame === 10) {
        // If this is the second bowl of the 10th frame
        if (timesBowled === 1) {
          if (bowl === pinsLeft) {
            // check to display spare or strike
            if (scoreboard[9][0] === "X") {
              scoreArr[curFrame - 1].push("X");
            } else {
              scoreArr[curFrame - 1].push("/");
            }
            this.setState({
              ...this.state,
              curFrame: curFrame,
              timesBowled: timesBowled + 1,
              pinsLeft: 10,
              scoreboard: scoreArr
            });
            // if no strike on first roll end game else prep for third roll
          } else if (bowl !== pinsLeft) {
            if (scoreboard[9][0] === "X") {
              scoreArr[curFrame - 1].push(bowl.toString());
              this.setState({
                ...this.state,
                curFrame: curFrame,
                timesBowled: timesBowled + 1,
                pinsLeft: pinsLeft - bowl,
                scoreboard: scoreArr
              });
            } else {
              scoreArr[curFrame - 1].push(bowl.toString());
              this.setState({
                ...this.state,
                curFrame: curFrame + 1,
                timesBowled: 0,
                pinsLeft: 10,
                scoreboard: scoreArr
              });
            }
          }
          // 10th frame third bowl scoring
        } else if (timesBowled === 2) {
          if (bowl === pinsLeft) {
            if (scoreboard[9][1] === "X" || scoreboard[9][1] === "/") {
              scoreArr[curFrame - 1].push("X");
            } else {
              scoreArr[curFrame - 1].push("/");
            }
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
        }
        // if it's not 10th frame use normal two roll frame logic
      } else if (curFrame < 10) {
        // if roll was equal to remaining pins, set spare and advance frame
        if (bowl === pinsLeft) {
          scoreArr[curFrame - 1].push("/");
          this.setState({
            ...this.state,
            curFrame: curFrame + 1,
            timesBowled: 0,
            pinsLeft: 10,
            scoreboard: scoreArr
          });
          // if roll was not equal to remaining pins, set score and advance frame
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
      }

      // If first bowl of the frame
    } else if (timesBowled === 0) {
      if (bowl === 10) {
        scoreArr[curFrame - 1].push("X");
        // if the curFrame is 10, do not advance frame but reset pins
        if (curFrame === 10) {
          this.setState({
            ...this.state,
            timesBowled: timesBowled + 1,
            pinsLeft: 10,
            scoreboard: scoreArr
          });
          // Else advance frame and reset pins
        } else if (curFrame !== 10) {
          this.setState({
            ...this.state,
            curFrame: curFrame + 1,
            timesBowled: 0,
            pinsLeft: 10,
            scoreboard: scoreArr
          });
        }
        // If not a strike record score and go to next bowl
      } else if (bowl < 10) {
        scoreArr[curFrame - 1].push(bowl.toString());
        this.setState({
          ...this.state,
          timesBowled: timesBowled + 1,
          pinsLeft: pinsLeft - bowl,
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
