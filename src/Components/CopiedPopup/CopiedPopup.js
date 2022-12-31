import { useState } from 'react';
import cx from '../../Tools/cx.js';

function CopiedPopup() {
  // Determines if the popup is shown or not
  const [isShown, setShown] = useState(false);


  return (
    <>
      <button className="copiedPopupButton" onClick={() => {
        console.log('clicked!');
        setShown(true)}
        }>
        Click me
      </button>

      <div
        onTransitionEnd = {() => setShown(false)}
        className={cx(
          'copiedPopup', 'mainText', isShown && 'copiedPopup-shown', !isShown && 'copiedPopup-hidden'
          )}
      >
        Copied!
      </div>

    </>
  );
}

export default CopiedPopup;