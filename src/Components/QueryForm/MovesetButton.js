import React from 'react';
import cx from '../../Tools/cx';

/**
 * @param {*} props
 * value={letter}
 * key={letter}
 * handleMovesetClick={props.handleMovesetClick}
 * totalButtonsToggled={props.queriesState.moveset.length}
 * isToggled={props.queriesState.moveset.includes(letter)}
 *
 * props.handleMovesetClick is passed from solve->QueryForm->MovesetButton.
 *
 * @usage Used in QueryForm.js
 */
function MovesetButton(props) {

    return (
        <button
        // if a button is toggled it will render with the isToggled class
            className={cx('mainText', 'secondaryColor', 'movesetButton', props.isToggled && 'isToggled')}
            onClick={() => props.handleMovesetClick(props.value)}
        >
            {props.value}
        </button>
    );
}

export default MovesetButton;