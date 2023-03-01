/**
 * This is the popup that appears when the user encounters an error, such as entering a bad value
 * @param {*}
 * errorMessage - the string for the message that should be used in the popup
 * killErrorPopup - re-render the solve page and remove ErrorPopup from rendering
 * @usage used in Solve.js
 */
function ErrorPopup({ errorMessage, killErrorPopup }) {
  return (
    <div
      onAnimationEnd={killErrorPopup}
      className="errorPopup fade-out errorColor"
    >
      {errorMessage}
    </div>
  )
}

export default ErrorPopup;