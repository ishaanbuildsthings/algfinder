import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import UseWindowSize from '../../Tools/UseWindowSize';
import TwistyPlayer from 'cubing/twisty'; // this lets us use the custom web component

/**
 * This Cube component is used on the solve page. The cube component is a wrapper
 * of the custom HTML element <twisty-player> from the cubing.js library.
 *
 * @param {*}
 * scramble - the current entered scramble
 * @usage Used in solve.js
 */
export default function Cube({scramble}) {
  // custom hook to dynamically re-render on window size changes
  let windowSize = UseWindowSize();

  function setDragText() {
    if (windowSize.width < 360) {
      return 'Drag';
    } else if (windowSize.width <= 767) {
      return 'Drag cube';
    }
    return 'Drag cube to view';
  }

  return (
    <div className="cubePanel">

      <twisty-player
                    visualization="PG3D"
                    control-panel="none"
                    background="none"
                    alg={scramble}
                    >
      </twisty-player>

      <div className="dragIconAndText mainText">
        <FontAwesomeIcon icon={faUpDownLeftRight} className="fa-lg"/>
        <p className="dragText">&nbsp;&nbsp;{setDragText()}</p>
      </div>

     </div>
  );
}