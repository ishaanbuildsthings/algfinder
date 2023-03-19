import { useCallback, useState } from 'react';

import 'cubing/twisty';

import getQtmAndStm from '@/utils/getQtmAndStm';
import wait from '@/utils/wait.js';

import GenericPopup from '@/Components/GenericPopup/GenericPopup';

/**
 * This is a single solution that appears in the list of generated solutions
 * @param
 * solution - the string form of the solution which is used to convert it to include QTM and STM metrics
 * mostRecentAlg - the alg that will run on animation
 * setMostRecentAlgToSolution - will run the setter for the most recent alg on the solution
 * proceedToNextStepCannotSolveRoyride - jumps to the next step for the cannot solve cube joyride if the current step is at the animate section
 * index - denotes the number of the solution
 * @usage used in SolutionsDisplayContainer.js
 */
export default function Solution({
  solution,
  mostRecentAlg,
  setMostRecentAlgToSolution,
  proceedToNextStepCannotSolveJoyride,
  index,
}) {
  // * useStates
  // every solution maintains a state for if its copy popup is showing
  const [isCopyPopup, setCopyPopup] = useState(false);
  // decides if the twisty-alg-viewer should show and the solution should hide
  const [isViewer, setIsViewer] = useState(false);

  // * calculations
  // no useMemo due to overhead
  const [sliceTurnMetric, halfTurnMetric] = getQtmAndStm(solution);

  // * functions

  const applyAlgAndAnimate = useCallback(async () => {
    proceedToNextStepCannotSolveJoyride();
    setMostRecentAlgToSolution();
    setIsViewer(true);
    const cube = document.querySelector('.cube');
    cube.jumpToStart(); // kill the prior .play execution and reset the cube state
    // the code seems to work without this, but I'm not sure if it is consistent due to its being an external library, therefore, I assign the alg of the cube manually to ensure when the solve is run it is done with the right alg
    cube.alg = solution;
    // if our cube has never had an alg applied, meaning we are clicking on a solution for the first time, don't wait, but if it has had an alg applied (user jumping around between solutions), then wait a bit at the start so they can see it was set back to the original scramble first
    if (mostRecentAlg !== '') {
      // console.log('hit 2'); // for debugging
      await wait(500);
    }
    // console.log('hit') // for debugging
    cube.play({
      onFinished: () => {
        console.log('done');
      },
    });
    // setMostRecentAlgToSolution should only change when the solution does
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mostRecentAlg,
    proceedToNextStepCannotSolveJoyride,
    solution,
    setMostRecentAlgToSolution,
  ]);

  const handleCopyAndPopup = useCallback(() => {
    navigator.clipboard.writeText(solution);
    setCopyPopup(true);
  }, [solution]);

  // a solution will toggle between showing the generated solution and the twisty-alg-viewer inside the button text, whenever the animate button is clicked
  return (
    <li className="solutionLi mainText">
      {isCopyPopup && (
        <GenericPopup
          killPopup={() => setCopyPopup(false)}
          message="Copied to clipboard!"
          popupType="copy"
        />
      )}
      <div className="buttonContainer">
        <div className="solution">
          {index + 1}.&nbsp;&nbsp;
          {isViewer && (
            <>
              <twisty-alg-viewer for="main-player" /> ({sliceTurnMetric}s,{' '}
              {halfTurnMetric}q)
            </>
          )}
          {!isViewer && (
            <>
              {solution} ({sliceTurnMetric}s, {halfTurnMetric}q)
            </>
          )}
        </div>

        <button
          type="button"
          className="animateButton"
          onClick={applyAlgAndAnimate}
        >
          animate
        </button>
        <button
          type="button"
          className="copyButton"
          onClick={handleCopyAndPopup}
        >
          copy
        </button>
      </div>
    </li>
  );
}
