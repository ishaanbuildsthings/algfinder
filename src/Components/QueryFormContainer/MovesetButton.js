import cx from '../../Tools/cx';

/**
 * @param {*}
 * value - the letter of the button
 * handleMoveSetClick - modifies the solve.js level state when a move is clicked
 * isToggled - tells whether the button is currently toggled by reading the solve.js state
 *
 * @usage Used in QueryForm.js
 * props.handleMovesetClick is passed from solve->QueryForm->MovesetButton
 */
function MovesetButton({value, handleMovesetClick, isToggled}) {

    return (
        <button
            className={cx('mainText', 'secondaryColor', 'movesetButton', isToggled && 'isToggled')}
            onClick={() => handleMovesetClick(value)}
        >
            {value}
        </button>
    );
}

export default MovesetButton;