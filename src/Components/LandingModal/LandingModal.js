import ReactModal from 'react-modal';
import { useState } from 'react';
import './LandingModal.css';

export default function LandingModal() {
  const [isModalShowing, setIsModalShowing] = useState(true);

  return (
  <>
      {isModalShowing && (<ReactModal
        isOpen={isModalShowing}
        className="landingModal"
        overlayClassName="overlayModal"
      >
        <p>

        </p>
        <button onClick={() => setIsModalShowing(false)}>
          Let's go!
        </button>
      </ReactModal>)
  }
  </>
  );
}