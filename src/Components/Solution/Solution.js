import { useState } from 'react';
import CopyPopup from '../CopyPopup/CopyPopup';

function getQtmAndStm(solution) {
  const noSpacesPrimeOrDouble = solution.replace(/ /g, '').replace(/'/g, '').replace(/2/g, '');
  const totalSliceMoves = (noSpacesPrimeOrDouble.match(/E/g) || []).length +
  (noSpacesPrimeOrDouble.match(/S/g) || []).length +
  (noSpacesPrimeOrDouble.match(/M/g) || []).length;
  const sliceTurnMetric = noSpacesPrimeOrDouble.length;
  const halfTurnMetric = sliceTurnMetric + totalSliceMoves;
  return [sliceTurnMetric, halfTurnMetric]
}

/**
 * @param {*}
 * solution - the string form of the solution which is used to convert it to include QTM and STM metrics
 * @usage used in SolutionsDisplay.js
 */
function Solution({solution}) {
  // every solution maintains a state for if its popup is showing
  const [isPopup, setPopup] = useState(false);

  const [sliceTurnMetric, halfTurnMetric] = getQtmAndStm(solution);

  return (
    <li className="solutionLi mainText" key={solution}>
      {isPopup && <CopyPopup setPopup={setPopup}/>}
      <button onClick={() => {
          navigator.clipboard.writeText(solution);
          setPopup(true);
      }}
          className="solutionButton">
          {solution} ({sliceTurnMetric}s, {halfTurnMetric}q)
      </button>
    </li>
  );
}

export default Solution;