import { useState } from 'react';
import CopyPopup from '../CopyPopup/CopyPopup';

function getQtmAndStm(solution) {
  const noSpacesPrimeOrDouble = solution.replace(/[ '2]/g, "");
  const totalSliceMoves = (noSpacesPrimeOrDouble.match(/ESM/g) || []).length;
  const sliceTurnMetric = noSpacesPrimeOrDouble.length;
  const halfTurnMetric = sliceTurnMetric + totalSliceMoves;
  return [sliceTurnMetric, halfTurnMetric];
}

/**
 * @param {*}
 * solution - the string form of the solution which is used to convert it to include QTM and STM metrics
 * @usage used in SolutionsDisplayContainer.js
 */
function Solution({ solution }) {
  // every solution maintains a state for if its popup is showing
  const [isPopup, setPopup] = useState(false);
  const [sliceTurnMetric, halfTurnMetric] = getQtmAndStm(solution);

  return (
    <li className="solutionLi mainText" key={solution}>
      {isPopup && <CopyPopup setPopup={setPopup} />}
      <button
        onClick={() => {
          navigator.clipboard.writeText(solution);
          setPopup(true);
        }}
        className="solutionButton"
      >
        {solution} ({sliceTurnMetric}s, {halfTurnMetric}q)
      </button>
    </li>
  );
}

export default Solution;

// TODO: R2 U R U R' U' R' U' R' U R', 11, RU gives a keyerror
// TODO: unique keys on R U length 5
