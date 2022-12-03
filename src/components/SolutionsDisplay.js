import React from 'react';

function SolutionsDisplay(props) {

    function displaySolutions(solutions) {
        const solutionsJsx = [];
        for (let i = 0; i < solutions.length; i++) {
           solutionsJsx.push(
               <p>{i + 1}.&nbsp;&nbsp;&nbsp;{solutions[i]} ({solutions[i].replace(/ /g, "").replace(/'/g, "").replace(/2/g, "").length})</p>
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