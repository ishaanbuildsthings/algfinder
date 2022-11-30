import React from 'react';
import cx from '../tools/cx';

function MovesetButton(props) {

    const [toggled, setToggled] = React.useState(false);

    // when a button is clicked, it toggles both its darkened state, and the parent allowed moveset state
    function toggleParentAndDarkened() {
        props.changeMove(props.id)
        setToggled(!toggled);
    }

    return (
        <button
            className={cx("form--movesetButton", toggled && "isToggled")}
            name={props.name}
            value={props.value}
            onClick={toggleParentAndDarkened}
        >  {props.value}
        </button>
    );
}

export default MovesetButton;