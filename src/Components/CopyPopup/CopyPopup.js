/**
 *  This is a popup that appears when a user clicks on a solution to copy it to their clipboard
 * @param {*}
 * killPopup - toggles off the existence of the CopyPopup
 * @usage used in Solution.js
 */
function CopyPopup({ killPopup }) {
  return (
    <div
      className="fade-out copyPopup accentColor"
      onAnimationEnd={killPopup}
    >
      Copied!
    </div>
  );
}

export default CopyPopup;
