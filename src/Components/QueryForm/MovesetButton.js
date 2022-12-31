import cx from '../../Tools/cx';

/**
 * @param {*} props
 * value={letter}
 * handleMovesetClick={props.handleMovesetClick}
 * isToggled={props.queriesState.moveset.includes(letter)}
 *
 * props.handleMovesetClick is passed from solve->QueryForm->MovesetButton.
 *
 * @usage Used in QueryForm.js
 */
function MovesetButton({value, handleMovesetClick, isToggled}) {

    return (
        <button
        // if a button is toggled it will render with the isToggled class
            className={cx('mainText', 'secondaryColor', 'movesetButton', isToggled && 'isToggled')}
            onClick={() => handleMovesetClick(value)}
        >
            {value}
        </button>
    );
}

export default MovesetButton;