import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import UseWindowSize from '../../Tools/UseWindowSize';

/**
 * This function defines the cube component, which is used on the solve page. The cube component is a wrapper
 * of the custom HTML element <twisty-player> from the cubing.js library.
 *
 * @param {*} props The props contain the current Rubik's cube scramble held in the state on solve.js.
 * @usage Used in solve.js
 */
export default function Cube(props) {
  // custom hook to dynamically re-render on window size changes
  let windowSize = UseWindowSize();

  return (
    <div className="cubePanel">

      <twisty-player
                    visualization="PG3D"
                    control-panel="none"
                    background="none"
                    alg={props.scramble}
                    >
      </twisty-player>

      <div className="dragIconAndText mainText">
        <FontAwesomeIcon icon={faUpDownLeftRight} className="fa-lg"/>
        <p className="dragText">&nbsp;&nbsp;{windowSize.width <= 800 ? 'Drag Cube' : 'Drag cube to view'}
        </p>
      </div>

     </div>
  );
}

// TODO: change css to dynamic