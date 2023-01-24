import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Solution from '../Solution/Solution';
import './SolutionsDisplayContainer.css';

/**
 * @param {*}
 * handleSort - a handler which re-orders the parent solution order state
 * solutionsList - the list of string solutions
 * @usage Used in Solve.js
 */
function SolutionsDisplayContainer({ handleSort, solutionsList }) {

  const JsxSolutions = solutionsList.map((solution) => (
    <Solution solution={solution} key={solution} />
  ));

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
          {/* when this onclick is triggered it sorts the state, causing a re-render, so the below JSX should change */}
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
          <ol className="solutionsOl">{JsxSolutions}</ol>
        </div>
      </div>
    </div>
  );
}

export default SolutionsDisplayContainer;
//TODO: export default memo(SolutionsDisplayContainer); // never re-renders unless the prop (a state, which does not change upon re-render of the parent) changes