import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function SolutionsDisplay(props) {
    // * states
    // ["solution 1", "solution 2" ...]
    // when more solutions are found, props change, but solutionState does not, useState explicitly only registers the FIRST time
    const [solutionState, setSolutionState] = React.useState(props.solutionsList);
    // this lets the state update dynamically
    React.useEffect(() => {
        setSolutionState(props.solutionsList);
    }, [props.solutionsList]);


    // * handlers
    // handles clicking on the solution text, copies the text
    function handleClickOnSolution() {
        navigator.clipboard.writeText("test copy");
    }

    // handles clicking the sort button
    // e.target.value is the value of whether the stm or qtm sort button was clicked
    function handleClickOnSort(e) {
        const reorderedList = sortSolutionsDictByMoves(solutionsListToDictMapping(solutionState), e.target.value);
        setSolutionState(reorderedList);
    }

    // * helpers
    // takes in an input of ["solution 1", "solution 2" ...]
    // outputs { "solution 1" : [1, 2], "solution 2" : [3, 4] }
    function solutionsListToDictMapping(solutions) {
        let solutionsDictWithMovecounts = {};
        for (let i = 0; i < solutions.length; i++) {
            const noSpacesPrimeOrDouble = solutions[i].replace(/ /g, "").replace(/'/g, "").replace(/2/g, "");
            const totalSliceMoves = (noSpacesPrimeOrDouble.match(/E/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/S/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/M/g) || []).length;
            // maps a solution to [A, B] where A is the STM and B is the QTM
            solutionsDictWithMovecounts[solutions[i]] = [noSpacesPrimeOrDouble.length, noSpacesPrimeOrDouble.length + totalSliceMoves];
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
            if (stmOrQtm === 'stm') {
                return listA[0] - listB[0];
            } else {
                return listA[1] - listB[1];
            }
        });
        return strings;
    }

    // takes in an input of ["M U M2 U2 M'", "R2 U R U R' R' U F R U"]
    // outputs a JSX of those elements
    function displaySolutions(solutions) {
        const solutionsJsx = [];
        for (let i = 0; i < solutions.length; i++) {
            const noSpacesPrimeOrDouble = solutions[i].replace(/ /g, "").replace(/'/g, "").replace(/2/g, "");
            const totalSliceMoves = (noSpacesPrimeOrDouble.match(/E/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/S/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/M/g) || []).length;

            const sliceTurnMetric = noSpacesPrimeOrDouble.length;
            const halfTurnMetric = sliceTurnMetric + totalSliceMoves;

            solutionsJsx.push(
                // key needed to not throw error
                <li className="solutionLi" key={solutions[i]}>
                    <button onClick={handleClickOnSolution} className="solutionButton">
                        &nbsp;&nbsp;&nbsp;{solutions[i]} ({sliceTurnMetric}s, {halfTurnMetric}q)
                    </button>

                </li>
            );
        }
        return solutionsJsx;
    }

    return (
         <div className="solutionsDisplay">
            <div className="solutionsHeader">
                <FontAwesomeIcon icon={faCircleInfo} className="circleIconSolutions fa-sm"/>
                {/* when this onclick is triggered it sorts the state, causing a re-render, so the below JSX should change */}
                <button onClick={handleClickOnSort} className="sortButton qtmButton" value="qtm">Sort by QTM</button>
                <button onClick={handleClickOnSort} className="sortButton stmButton" value="stm">Sort by STM</button>
            </div>
            <div className="scrollableSolutions">
                <ol className="solutionsOl">
                    {/* display solutions creates the JSX for our solutions */}
                    {displaySolutions(solutionState)}
                    <li className="solutionLi">&nbsp;&nbsp;&nbsp;test solution here</li>
                </ol>
            </div>
         </div>
    );
}

export default SolutionsDisplay;