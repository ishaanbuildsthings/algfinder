import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Solution from '../Solution/Solution';
import mapSolutionsListToDict from '../../Utils/mapSolutionsListToDict';
import sortSolutionsDictByMoves from '../../Utils/sortSolutionsDictByMoves';
import { useState, useEffect } from 'react';
import './SolutionsDisplayContainer.css';

/**
 * @param {*}
 * solutionsList - the list of string solutions
 * @usage Used in Solve.js
 */
function SolutionsDisplayContainer({ solutionsList }) {
  // * states
  // ["solution 1", "solution 2" ...]
  // when more solutions are found, props change, but solutionState does not, useState explicitly only registers the first time
  const [solutionsState, setSolutionsState] = useState(solutionsList);
  // this lets the state update dynamically
  useEffect(() => {
    setSolutionsState(solutionsList);
  }, [solutionsList]);
  //todo

  const JsxSolutions = solutionsState.map((solution) => (
    <Solution solution={solution} key={solution} />
  ));

  // * handlers
  // e.target.value is the value of whether the stm or qtm sort button was clicked
  function handleClickOnSort(e) {
    const reorderedList = sortSolutionsDictByMoves(
      mapSolutionsListToDict(solutionsState),
      e.target.value
    );
    setSolutionsState(reorderedList);
  }

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
            onClick={handleClickOnSort}
            className="sortButton mainText qtmButton"
            value="qtm"
          >
            Sort by QTM
          </button>
          <button
            onClick={handleClickOnSort}
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