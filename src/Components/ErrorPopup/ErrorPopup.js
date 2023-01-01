import './ErrorPopup.css';

/**
 * @param {*}
 * errorMessage - the string for the message that should be used in the popup
 * setErrorPopup - the setter which can re-render the solve page and remove ErrorPopup from rendering
 * @usage used in Solve.js
 */
function ErrorPopup({ errorMessage, setErrorPopup }) {
  return (
    <div onAnimationEnd={() => setErrorPopup(false)} className="mainColor errorPopup fade-out errorColor">{errorMessage}</div>
  )
}

export default ErrorPopup;