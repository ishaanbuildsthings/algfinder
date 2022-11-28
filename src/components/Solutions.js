import React from 'react';

function Solutions() {

    const [solutionsList, setSolutionsList] = React.useState("");

    // React.useEffect(() => {
    //     async function getSolutions() {
    //         const res = await fetch('http://127.0.0.1:5000/solve?scramble=R&max_depth=R&move_types=2');
    //         console.log(res);
    //     }
    //     getSolutions();
    //
    // }, [])


    return (
        <section>
            <p
                className="solutions"
            >
                Temporary Solution Text Here
                {solutionsList}
            </p>
        </section>
    );
}

export default Solutions;