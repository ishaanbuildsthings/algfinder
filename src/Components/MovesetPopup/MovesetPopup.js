/**
 * This is a popup that appears if a user tries to enter more than 4 move types
 * @param
 * errorMessage - the string for the message that should be used in the popup
 * killMovesetPopup - re-render the solve page and remove ErrorPopup from rendering
 * @usage used in Solve.js
 */
export default function MovesetPopup({ killMovesetPopup }) {
  return (
    <div
      onAnimationEnd={killMovesetPopup}
      className="movesetPopupError fade-out errorColor"
    >
      Please choose at most 4 moves!
    </div>
  );
}
