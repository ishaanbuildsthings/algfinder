import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //TODO: what was this
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons'; // 4-directional arrow
import UseWindowSize from '../Tools/UseWindowSize';

// TODO: change span method to react hook
/**
 * This function defines the cube component, which is used on the solve page. The cube component is a wrapper
 * of the custom HTML element <twisty-player> from the cubing.js library.
 *
 * @param {*} props The props contain the current Rubik's cube scramble held in the state on solve.js.
 * @usage Used in solve.js
 */
export default function Cube(props) {
  // * misc
  let windowSize = UseWindowSize();

  // * jsx
  return (
    <>

      <twisty-player
                    visualization="PG3D"
                    control-panel="none"
                    background="none"
                    alg={props.scramble}
                    >
      </twisty-player>

      <div className="dragIconAndText">
        <FontAwesomeIcon icon={faUpDownLeftRight} className="upDownLeftRight fa-lg" color="white"/>
        <p className="dragText">&nbsp;&nbsp;{windowSize.width <= 800 ? 'Drag Cube' : 'Drag cube to view'}
        </p>
      </div>

     </>
  );
}