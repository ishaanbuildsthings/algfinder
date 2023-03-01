import { memo, useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import cx from '../../utils/cx.js';

import Solution from './Solution/Solution';

import './SolutionsDisplayContainer.css';

/**
 * This is the component for all the solutions that appear when a user queries a scramble
 * @param
 * handleSort - a handler which re-orders the parent solution order state
 * mostRecentAlg - the alg that will run on animation
 * setMostRecentAlg - setter for the alg
 * solutionsList - the list of string solutions
 * @usage Used in Solve.js
 */
function SolutionsDisplayContainer({ handleSort, mostRecentAlg, setMostRecentAlg, solutionsList }) {

  // * calculations
  // creates JSX elements for the solutions
  const JsxSolutions = useMemo(() => solutionsList.map((solution) => (
    <Solution
      solution={solution}
      key={solution}
      mostRecentAlg={mostRecentAlg}
      setMostRecentAlgToSolution={() => setMostRecentAlg(solution)}
    />
  )), [mostRecentAlg, solutionsList]); // todo

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
                Any found solutions will be displayed here. Click a solution to
                copy it to your clipboard. All solutions that exist for a query
                will be found.
              </p>
            </div>
          </div>
          <div className="solutionsHeaderSpacer"></div>
          <button
            onClick={handleSort}
            className="sortButton mainText qtmButton"
            value="qtm"
          >
            Sort by QTM
          </button>
          <button
            onClick={handleSort}
            className="sortButton mainText"
            value="stm"
          >
            Sort by STM
          </button>
        </div>
        <div className="scrollableSolutions secondaryColor">
          <ol
            className={cx('solutionsOl', solutionsList.length >= 100 && 'shouldApplyPadding')}
          >
            {JsxSolutions}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default memo(SolutionsDisplayContainer); // never re-renders unless the prop (a state, which does not change upon re-render of the parent) changes