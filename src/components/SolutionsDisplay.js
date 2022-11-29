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
        <section>
            <p
                className="solutions"
            >
                {displaySolutions(props.solutionsList)}
            </p>
        </section>
    );
}

export default SolutionsDisplay;