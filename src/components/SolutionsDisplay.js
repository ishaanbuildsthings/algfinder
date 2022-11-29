import React from 'react';

function SolutionsDisplay(props) {

    function displaySolutions(solutions) {
        const solutionsJsx = [];
        for (let solution of solutions) {
           solutionsJsx.push(
               <p>{solution}</p>
           );
        }
        return solutionsJsx;
    }


    return (
        <section className="solutions">
                {displaySolutions(props.solutionsList)}
        </section>
    );
}

export default SolutionsDisplay;