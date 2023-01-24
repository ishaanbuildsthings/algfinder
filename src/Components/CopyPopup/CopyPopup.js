/**
 * @param {*}
 * setPopup - a unique setter function that can toggle off the existence of the CopyPopup
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
