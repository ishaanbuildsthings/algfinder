import cx from '../../Utils/cx';

/**
 * @param {*}
 * value - the letter of the button
 * handleMoveSetClick - modifies the Solve.js level state when a move is clicked
 * isToggled - tells whether the button is currently toggled by reading the Solve.js state
 *
 * @usage Used in QueryFormContainer.js
 * props.handleMovesetClick is passed from solve->QueryForm->MovesetButton
 */
function MovesetButton({ value, handleMovesetClick, isToggled }) {
  return (
    <button
      className={cx(
        'mainText',
        !isToggled && 'secondaryColor',
        'movesetButton',
        isToggled && 'isToggled accentColor'
      )}
      onClick={() => handleMovesetClick(value)}
    >
      {value}
    </button>
  );
}

export default MovesetButton;
