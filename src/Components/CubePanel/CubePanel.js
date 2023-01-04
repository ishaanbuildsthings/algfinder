import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';
import TwistyPlayer from 'cubing/twisty'; // this lets us use the custom web component
import UseWindowSize from '../../Hooks/UseWindowSize';
import processMoves from '../../processMoves';
import './CubePanel.css';

const MemoizedFontAwesomeIcon = memo(FontAwesomeIcon);

/**
 * This Cube component is used on the solve page. The cube component is a wrapper
 * of the custom HTML element <twisty-player> from the cubing.js library.
 *
 * @param {*}
 * scramble - the currently entered scramble
 * @usage Used in Solve.js
 */
function Cube({ scramble }) {
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

  console.log(processMoves(scramble))

  return (
    <div className="cubePanel">
      <twisty-player
        visualization="PG3D"
        control-panel="none"
        background="none"
        alg={processMoves(scramble)}
      ></twisty-player>

      <div className="dragIconAndText mainText">
        <MemoizedFontAwesomeIcon icon={faUpDownLeftRight} className="fa-lg" />
        <p className="dragText">&nbsp;&nbsp;{setDragText()}</p>
      </div>
    </div>
  );
}

export default memo(Cube); // the cube should only re-render if its props change