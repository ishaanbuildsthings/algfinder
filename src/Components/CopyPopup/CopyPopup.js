/**
 *
 * @param {*}
 * setPopup - a unique setter function that can toggle off the existence of the CopyPopup
 * @usage used in Solution.js
 */
function CopyPopup({setPopup}) {
  return (
    <div className="fade-out mainText copyPopup mainColor" onAnimationEnd={() => setPopup(false)}>
      Copied!
    </div>
  );
}

export default CopyPopup;