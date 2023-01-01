import './MovesetPopup.css';

/**
 * @param {*}
 * errorMessage - the string for the message that should be used in the popup
 * setErrorPopup - the setter which can re-render the solve page and remove ErrorPopup from rendering
 * @usage used in Solve.js
 */
function MovesetPopup({ setMovesetPopup }) {
  return (
    <div onAnimationEnd={() => setMovesetPopup(false)} className="mainColor movesetPopupError fade-out errorColor">Please choose at most 4 moves!</div>
  )
}

export default MovesetPopup;