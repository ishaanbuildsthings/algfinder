import React from 'react';
import cx from '../../Tools/cx.js';

function CopiedPopup() {
  // Determines if the popup is shown or not
  const [isShown, setShown] = React.useState(false);

  if (isShown) {
    console.log('this is running');
    console.log(isShown);
  }

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