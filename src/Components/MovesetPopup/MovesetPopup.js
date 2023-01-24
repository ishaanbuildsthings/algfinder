/**
 * @param {*}
 * errorMessage - the string for the message that should be used in the popup
 * setErrorPopup - the setter which can re-render the solve page and remove ErrorPopup from rendering
 * @usage used in Solve.js
 */
function MovesetPopup({ killMovesetPopup }) {
  return (
    <div onAnimationEnd={killMovesetPopup} className="movesetPopupError fade-out errorColor">Please choose at most 4 moves!</div>
  )
}

export default MovesetPopup;