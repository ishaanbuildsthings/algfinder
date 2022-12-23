import React from 'react';
import cx from '../../Tools/cx';

/**
 * @param {*} props
 * The props contain the moveset button's value, which is the buttons corresponding letter.
 * This prop is passed down from QueryForm, which constructs the grid of buttons via a for loop.
 *
 * The props also contain props.handleMovesetClick, a function passed from solve->QueryForm->MovesetButton. This function
 * changes the state of which buttons are currently toggled.
 *
 * @usage Used in QueryForm.js
 */
function MovesetButton(props) {

    // * states
    // each button tracks its own toggled state to know if it should be in dark mode
    // ? can re-factor this to have it done at the solve.js level, but this may be better separation of concerns
    const [toggled, setToggled] = React.useState(false);

    // * handlers
    // when a button is clicked, it toggles its darkened state, and solve.js's list of currently toggled moves
    function toggleParentAndDarkened() {
        props.handleMovesetClick(props.value);
        setToggled(!toggled);
    }

    // * jsx
    return (
        <button
            className={cx("movesetButton", "interactable", "userInteractField", toggled && "isToggled", "button")}
            onClick={toggleParentAndDarkened}
        >
            {props.value}
        </button>
    );
}

export default MovesetButton;