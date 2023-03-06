import { memo, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import cx from '@/utils/cx.js';

import Solution from '@/Components/SolutionsDisplayContainer/Solution/Solution.js';

import '@/Components/SolutionsDisplayContainer/SolutionsDisplayContainer.css';

/**
 * This is the component for all the solutions that appear when a user queries a scramble
 * @param
 * handleSort - a handler which re-orders the parent solution order state
 * mostRecentAlg - the alg that will run on animation
 * setMostRecentAlg - setter for the alg
 * solutionsList - the list of string solutions
 * proceedToNextStepCannotSolveJoyride - jumps to the next step for the cannot solve cube joyride if the current step is at the animate section
 * @usage Used in Solve.js
 */
function SolutionsDisplayContainer({
  handleSort,
  mostRecentAlg,
  setMostRecentAlg,
  solutionsList,
  proceedToNextStepCannotSolveJoyride,
}) {
  // creates JSX elements for the solutions
  const JsxSolutions = useMemo(
    () =>
      solutionsList.map((solution, index) => (
        <Solution
          solution={solution}
          key={solution}
          index={index}
          mostRecentAlg={mostRecentAlg}
          proceedToNextStepCannotSolveJoyride={
            proceedToNextStepCannotSolveJoyride
          }
          setMostRecentAlgToSolution={() => {
            setMostRecentAlg(solution);
            console.log(`sol is: ${solution}`);
          }}
        />
      )),
    // setMostRecentAlg is a setter, so it is not needed in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mostRecentAlg, solutionsList, proceedToNextStepCannotSolveJoyride]
  );

  return (
    <div className="solutionsDisplayContainer">
      <div className="solutionsDisplay">
        <div className="solutionsHeader mainColor">
          <span className="mainText">Solutions</span>
          <div className="iconAndTooltip">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="solutionsIcon icon mainText"
            />
            <div className="solutionsTooltip tooltip accentColor">
              <p>
                Any found solutions will be displayed here. All solutions that
                exist for a query will be found. You can animate a solution or
                copy it to your clipboard.
              </p>
            </div>
          </div>
          <div className="solutionsHeaderSpacer" />
          <button
            type="button"
            onClick={handleSort}
            className="sortButton mainText qtmButton"
            value="qtm"
          >
            Sort by QTM
          </button>
          <button
            type="button"
            onClick={handleSort}
            className="sortButton mainText"
            value="stm"
          >
            Sort by STM
          </button>
        </div>
        <div className="scrollableSolutions secondaryColor">
          <ul
            className={cx(
              'solutionsUl',
              solutionsList.length >= 100 && 'shouldApplyPadding'
            )}
          >
            {JsxSolutions}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default memo(SolutionsDisplayContainer); // never re-renders unless the prop (a state, which does not change upon re-render of the parent) changes
