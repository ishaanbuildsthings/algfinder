import { useCallback, useState } from 'react';
import CopyPopup from '../CopyPopup/CopyPopup';
import getQtmAndStm from '../../Utils/getQtmAndStm';

/**
 * This is a single solution that appears in the list of generated solutions
 * @param {*}
 * solution - the string form of the solution which is used to convert it to include QTM and STM metrics
 * @usage used in SolutionsDisplayContainer.js
 */
function Solution({ solution }) {
  // every solution maintains a state for if its popup is showing
  const [isPopup, setPopup] = useState(false);

  const [sliceTurnMetric, halfTurnMetric] = getQtmAndStm(solution);

  return (
    <li className="solutionLi mainText">
      {isPopup && <CopyPopup killPopup={() => setPopup(false)} />}
      <button
        onClick={useCallback(() => {
          navigator.clipboard.writeText(solution);
          setPopup(true);
        }, [solution])}
        className="solutionButton"
      >
        {solution} ({sliceTurnMetric}s, {halfTurnMetric}q)
      </button>
    </li>
  );
}

export default Solution;
