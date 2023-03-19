import cx from '@/utils/cx';

import '@/Components/GenericPopup/GenericPopup.css';

/**
 * @params
 * message - the message displayed in the popup
 * killPopup - changes the state to not show the popup
 * popupType - the type of popup, either 'copy' or 'error', which affects the color of the popup
 */
export default function GenericPopup({ message, killPopup, popupType }) {
  return (
    <div
      className={cx(
        'popup',
        'fadeOutAnimation',
        popupType === 'copy' ? 'accentColor accentColorText' : 'errorColor'
      )}
      onAnimationEnd={killPopup}
    >
      {message}
    </div>
  );
}
