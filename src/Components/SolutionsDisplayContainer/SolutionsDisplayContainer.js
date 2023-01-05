import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Solution from '../Solution/Solution';
import { useState, useEffect, useCallback } from 'react';
import './SolutionsDisplayContainer.css';

// * helpers
// takes in an input of ["solution 1", "solution 2" ...]
// outputs { "solution 1" : [1, 2], "solution 2" : [3, 4] }
function mapSolutionsListToDict(solutions) {
  let solutionsDictWithMovecounts = {};
  for (let i = 0; i < solutions.length; i++) {
    const noSpacesPrimeOrDouble = solutions[i].replace(/ '2/g, '');
    const totalSliceMoves = (noSpacesPrimeOrDouble.match(/ESM/g));
    // maps a solution to [A, B] where A is the STM and B is the QTM
    solutionsDictWithMovecounts[solutions[i]] = [
      noSpacesPrimeOrDouble.length,
      noSpacesPrimeOrDouble.length + totalSliceMoves,
    ];
  }
  return solutionsDictWithMovecounts;
}

// takes in an input of { "solution 1" : [1, 2], "solution 2" : [3, 4] }
// outputs a list of the sorted solutions by STM: ["M U M2 U2 M'", "R2 U R U R' R' U F R U"]
function sortSolutionsDictByMoves(obj, stmOrQtm) {
  const strings = Object.keys(obj);
  strings.sort((a, b) => {
    const listA = obj[a];
    const listB = obj[b];
    if (stmOrQtm === "stm") {
      return listA[0] - listB[0];
    } else {
      return listA[1] - listB[1];
    }
  });
  return strings;
}

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