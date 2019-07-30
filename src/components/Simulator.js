import React, { Component } from "react";

class Simulator extends Component {
  /* List of vars
   * curFrame: 1, self explanatory
   * pinsLeft: 10, Counts pins remaining on subsequent bowls past first on a frame
   * timesBowled: 0, Number of times bowled in a frame
   * curScore: array of current running score
   * scoreboard: array of arrays, each individual array is a frame's score
   */

  state = {
    curFrame: 1,
    pinsLeft: 10,
    timesBowled: 0,
    curScore: [],
    scoreboard: [[], [], [], [], [], [], [], [], [], []]
  };

  componentDidMount() {
    this.startBowl();
  }

  componentWillUnmount() {
    clearInterval(this.state.simId);
  }

  // Start the sim with a interval between a bowl
  startBowl = () => {
    const simId = setInterval(() => {
      this.getBowl();
    }, 650);
    this.setState({ ...this.state, simId: simId });
  };

  // Generate bowl
  getBowl = () => {
    const { pinsLeft, curFrame, simId } = this.state;

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

  // Check the conditions and fill in scoreboard accordingly
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

    // Calculate score after bowl
    this.calcScore();
  };

  // Calcuate the score and display it
  // Spares are scored base 10 pts + next roll
  // Strikes are scord base 10 pts + next two rolls
  // 10th frame scored by itself
  // Inefficient but due to small input it can be justified
  calcScore = () => {
    const { curFrame, scoreboard } = this.state;
    var newCurScore = [];
    var runScore = 0;

    // Calculate score by iterating through each frame
    // Spares and strikes attempt to access future frames and do checks for them
    // Special frame check logic for 9th and 10th frames
    for (let i = 0; i < curFrame; i++) {
      // if the current frame is not completed do not recalc

      // NON-10th FRAME LOGIC
      if (i < 9) {
        if (scoreboard[i].length < 2) {
          if (!scoreboard[i].includes("X")) {
            break;
          }
        }
        // STRIKE LOGIC
        if (scoreboard[i].includes("X")) {
          // If frame has strike check if next frame exists
          // If there is nothing in next frame end scoring
          if (scoreboard[i + 1].length === 0) break;
          if (i === 8 && scoreboard[i + 1].length === 0) break;

          // 9TH FRAME STRIKE LOGIC
          if (i === 8) {
            // if 10th frame has less than 2 bowls stop
            if (scoreboard[i + 1].length < 2) break;

            // If tenth frame first roll is strike
            if (scoreboard[i + 1][0] === "X") {
              // If tenth frame second roll is strike score turkey
              if (scoreboard[i + 1][1] === "X") {
                runScore = runScore + 30;
                newCurScore[i] = runScore;
                this.setState({ ...this.state, curScore: newCurScore });
                // If tenth frame second roll not strike
              } else {
                runScore = runScore + 20 + parseInt(scoreboard[i + 1][1]);
                newCurScore[i] = runScore;
                this.setState({ ...this.state, curScore: newCurScore });
              }
              // If tenth frame second roll is spare
            } else if (scoreboard[i + 1][1] === "/") {
              runScore = runScore + 20;
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
              // If first two rolls of tenth frame has neither strike nor spare
            } else {
              runScore =
                runScore +
                10 +
                parseInt(scoreboard[i + 1][0]) +
                parseInt(scoreboard[i + 1][1]);
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
            }
            // NORMAL STRIKE LOGIC FRAMES 1-8
            // Check next frame after for bowls
          } else if (scoreboard[i + 1].includes("X")) {
            if (scoreboard[i + 2].length === 0) break;

            // if next frame after was also a strike, score turkey
            if (scoreboard[i + 2].includes("X")) {
              runScore = runScore + 30;
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
              // else just score the next bowl after the second strike on third frame
            } else {
              runScore = runScore + 20 + parseInt(scoreboard[i + 2][0]);
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
            }
            // if next bowl after not a strike take next two rolls in next frame
          } else {
            if (scoreboard[i + 1][1] === "/") {
              runScore = runScore + 20;
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
            } else {
              runScore =
                runScore +
                10 +
                parseInt(scoreboard[i + 1][0]) +
                parseInt(scoreboard[i + 1][1]);
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
            }
          }
          // SPARE LOGIC
        } else if (scoreboard[i].includes("/")) {
          // If the frame has a spare check if there is one additional bowl
          // If nothing in next frame end scoring
          if (scoreboard[i + 1].length === 0) break;

          // if next frame is a strike score base 10 plus 10 for strike
          if (scoreboard[i + 1].includes("X")) {
            runScore = runScore + 20;
            newCurScore[i] = runScore;
            this.setState({ ...this.state, curScore: newCurScore });
            // else score base 10 plus next roll
          } else {
            runScore = runScore + 10 + parseInt(scoreboard[i + 1][0]);
            newCurScore[i] = runScore;
            this.setState({ ...this.state, curScore: newCurScore });
          }

          // If frame did not have a spare/strike, score immediately
          // NORMAL FRAME LOGIC
        } else {
          runScore =
            runScore + parseInt(scoreboard[i][0]) + parseInt(scoreboard[i][1]);
          newCurScore[i] = runScore;
          this.setState({ ...this.state, curScore: newCurScore });
        }
        // 10th FRAME LOGIC
      } else if (i === 9) {
        // If there are less than 2 bowls in the frame end score
        if (scoreboard[i].length < 2) break;

        // If first bowl strike
        if (scoreboard[i][0] === "X") {
          // If strike if there are less than 3 bowls in the frame end score
          if (scoreboard[i].length < 3) break;

          // If 2 strikes
          if (scoreboard[i][1] === "X") {
            // If 3 strikes
            if (scoreboard[i][2] === "X") {
              runScore = runScore + 30;
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
              // else 2 strikes + 1 bowl
            } else {
              runScore = runScore + 20 + parseInt(scoreboard[i][2]);
              newCurScore[i] = runScore;
              this.setState({ ...this.state, curScore: newCurScore });
            }
            // if strike and spare
          } else if (scoreboard[i][2] === "/") {
            runScore = runScore + 20;
            newCurScore[i] = runScore;
            this.setState({ ...this.state, curScore: newCurScore });
            // if strike and two bowls
          } else {
            runScore =
              runScore +
              10 +
              parseInt(scoreboard[i][1]) +
              parseInt(scoreboard[i][2]);
            newCurScore[i] = runScore;
            this.setState({ ...this.state, curScore: newCurScore });
          }
          // If spare first two bowls
        } else if (scoreboard[i][1] === "/") {
          // If spare if there are less than 3 bowls in the frame end score
          if (scoreboard[i].length < 3) break;

          // If third bowl is strike
          if (scoreboard[i][2] === "X") {
            runScore = runScore + 20;
            newCurScore[i] = runScore;
            this.setState({ ...this.state, curScore: newCurScore });
            // If third bowl is regular
          } else {
            runScore = runScore + 10 + parseInt(scoreboard[i][2]);
            newCurScore[i] = runScore;
            this.setState({ ...this.state, curScore: newCurScore });
          }
          // if two regular bowls
        } else {
          runScore =
            runScore + parseInt(scoreboard[i][0]) + parseInt(scoreboard[i][1]);
          newCurScore[i] = runScore;
          this.setState({ ...this.state, curScore: newCurScore });
        }
      }
    }
  };

  render() {
    //console.log(this.state);
    const { scoreboard, curScore } = this.state;

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
            <td>Bowl</td>
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
          <tr>
            <td>Score</td>
            <th>{isNaN(curScore[0]) ? "" : curScore[0]}</th>
            <th>{isNaN(curScore[1]) ? "" : curScore[1]}</th>
            <th>{isNaN(curScore[2]) ? "" : curScore[2]}</th>
            <th>{isNaN(curScore[3]) ? "" : curScore[3]}</th>
            <th>{isNaN(curScore[4]) ? "" : curScore[4]}</th>
            <th>{isNaN(curScore[5]) ? "" : curScore[5]}</th>
            <th>{isNaN(curScore[6]) ? "" : curScore[6]}</th>
            <th>{isNaN(curScore[7]) ? "" : curScore[7]}</th>
            <th>{isNaN(curScore[8]) ? "" : curScore[8]}</th>
            <th>{isNaN(curScore[9]) ? "" : curScore[9]}</th>
          </tr>
        </tbody>
      </table>
    );
  }
}
export default Simulator;
