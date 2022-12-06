import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function SolutionsDisplay(props) {
    // handlers
    function handleClick() {
        navigator.clipboard.writeText("test copy");
    }

    function displaySolutions(solutions) {
        console.log(solutions);
        const solutionsJsx = [];
        for (let i = 0; i < solutions.length; i++) {
            const noSpacesPrimeOrDouble = solutions[i].replace(/ /g, "").replace(/'/g, "").replace(/2/g, "");
            const totalSliceMoves = (noSpacesPrimeOrDouble.match(/E/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/S/g) || []).length +
                                    (noSpacesPrimeOrDouble.match(/M/g) || []).length;

            const sliceTurnMetric = noSpacesPrimeOrDouble.length;
            const halfTurnMetric = sliceTurnMetric + totalSliceMoves;

            solutionsJsx.push(
                <li className="solutionLi">
                    <button onClick={handleClick} className="solutionButton">
                        &nbsp;&nbsp;&nbsp;{solutions[i]} ({sliceTurnMetric}s, {halfTurnMetric}q)
                    </button>
                </li>
            );
        }
        return solutionsJsx;
    }


    return (
        <section className="solutions">
            <FontAwesomeIcon icon={faCircleInfo} className="circleIconSolutions fa-sm" color="blue" />
            <ol>
                {displaySolutions(props.solutionsList)}
                <li className="solutionLi">&nbsp;&nbsp;&nbsp;test solution here</li>
            </ol>
        </section>
    );
}

export default SolutionsDisplay;