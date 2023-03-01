import { useCallback, useState } from 'react';

import wait from '../../../utils/wait.js';

import CopyPopup from '../../CopyPopup/CopyPopup';
import getQtmAndStm from '../../../utils/getQtmAndStm';

/**
 * This is a single solution that appears in the list of generated solutions
 * @param
 * solution - the string form of the solution which is used to convert it to include QTM and STM metrics
 * mostRecentAlg - the alg that will run on animation
 * setMostRecentAlgToSolution - will run the setter for the most recent alg on the solution
 * @usage used in SolutionsDisplayContainer.js
 */
export default function Solution({ solution, mostRecentAlg, setMostRecentAlgToSolution }) {
  // * useStates
  // every solution maintains a state for if its popup is showing
  const [isPopup, setPopup] = useState(false);

  // * calculations
  const [sliceTurnMetric, halfTurnMetric] = getQtmAndStm(solution);

  // * functions
  const applyAlgAndAnimate = useCallback(async () => {
    setMostRecentAlgToSolution();
    const cube = document.querySelector('.cube');
    cube.jumpToStart(); // kill the prior .play execution and reset the cube state
    // the code seems to work without this, but I'm not sure if it is consistent
    // therefore, I assign the alg of the cube manually to ensure when the solve is run it is done with the right alg
    cube.alg = solution;
    // if our cube has never had an alg applied, meaning we are clicking on a solution for the first time,
    // don't wait, but if it has had an alg applied (user jumping around between solutions), then wait a bit
    // at the start so they can see it was set back to the original scramble first
    if (mostRecentAlg !== '') {
      // console.log('hit 2') // for debugging
      await wait(1000);
    }
    // console.log('hit') // for debugging
    cube.play();
    // setMostRecentAlgToSolution shouldn't change, solution shouldn't change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostRecentAlg]);

  return (
    <li className="solutionLi mainText">
      {isPopup && <CopyPopup killPopup={() => setPopup(false)} />}
      <button
        onClick={useCallback(() => {
          navigator.clipboard.writeText(solution);
          applyAlgAndAnimate();
          setPopup(true);
          // applyAlgAndAnimate should not change unless their dependencies do
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [solution])}
        className="solutionButton"
      >
        {solution} ({sliceTurnMetric}s, {halfTurnMetric}q)
      </button>
    </li>
  );
};