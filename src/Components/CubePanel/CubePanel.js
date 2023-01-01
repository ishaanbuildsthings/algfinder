import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import TwistyPlayer from "cubing/twisty"; // this lets us use the custom web component
import UseWindowSize from "../../Hooks/UseWindowSize";
import './CubePanel.css';


function processMoves(scramble) {
  let result = '';

  for (let i = 0; i < scramble.length; i++) {
    if (i === scramble.length - 1 && /[RUFLDBxyzEMrufldb]/.test(scramble[i])) {
      return result + scramble[i];
    }
    if (/[RUFLDBxyzEMrufldb]/.test(scramble[i])) {
      result += scramble[i];
    }
    if (scramble[i + 1] === "'" || scramble[i + 1] === ' ' || scramble[i + 1] === '2') {
      result += scramble[i + 1];
    } else {
      result += ' ';
    }
  }
  return result;
}
/**
 * This Cube component is used on the solve page. The cube component is a wrapper
 * of the custom HTML element <twisty-player> from the cubing.js library.
 *
 * @param {*}
 * scramble - the currently entered scramble
 * @usage Used in Solve.js
 */
export default function Cube({ scramble }) {
  // custom hook to dynamically re-render on window size changes
  let windowSize = UseWindowSize();

  function setDragText() {
    if (windowSize.width < 360) {
      return "Drag";
    } else if (windowSize.width <= 767) {
      return "Drag cube";
    }
    return "Drag cube to view";
  }

  return (
    <div className="cubePanel">
      <twisty-player
        visualization="PG3D"
        control-panel="none"
        background="none"
        alg={processMoves(scramble)}
      ></twisty-player>

      <div className="dragIconAndText mainText">
        <FontAwesomeIcon icon={faUpDownLeftRight} className="fa-lg" />
        <p className="dragText">&nbsp;&nbsp;{setDragText()}</p>
      </div>
    </div>
  );
}
