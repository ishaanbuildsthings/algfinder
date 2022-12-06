import React from 'react';
import QueryForm from '../components/QueryForm';
import SolutionsDisplay from '../components/SolutionsDisplay';
import Cube from '../components/Cube';
import Navbar from '../components/Navbar';
const baseURL = 'http://127.0.0.1:3001';
const pollInterval = 1000; // ms

function Solve() {

    // states
    const [solutionsList, setSolutionsList] = React.useState([]); // directly drilled to SolutionDisplay

    const [queries, setQueries] = React.useState({
        scramble: "",
        moveset: [],
        depth: ""
    });


    // handlers
    function handleTextChange(event) {
        const {name, value} = event.target;
        setQueries({
            ...queries,
            [name]: value
        })
    }

    function handleNumberChange(event) {
        const {name, value} = event.target;
        const regex = value.replace(/\D/g, '');
        let result;

        if (regex === "") {
            result = "";
        } else {
        result = Math.min(100, regex);
        }

        setQueries({
            ...queries,
            [name]: result
        })

    }

    function handleMovesetClick(id) {
        if (!queries.moveset.includes(id)) {
            setQueries({
                ...queries,
                moveset: [...queries.moveset, id]
            });
        } else {
            setQueries({
                ...queries,
                moveset: queries.moveset.filter((element) => element !== id)
            });
        }
    }

    async function handleSubmit(queries) {
        setSolutionsList([])
        const {scramble, moveset, depth} = queries;
        const txn_id = await fetchURL(`${baseURL}/solve?scramble=${delimit(scramble)}&max-depth=${depth}&move-types=${delimitList(moveset)}`);
        console.log(`got txn_id: ${txn_id}`);

        let solns = []
        let keepGoing = true
        do {
            await sleep(pollInterval)
            solns = await fetchURL(`${baseURL}/solve-update?txn-id=${txn_id}`)
            console.log(solns)
            if (solns[solns.length-1] === 'DONE') {
                keepGoing = false
                solns.pop()
            }
            setSolutionsList(prevSolns => [...prevSolns, ...solns]);
        } while(keepGoing)
    }


    // tools

        // converts "R U D' R' F" to "R,U,D',R',F"
    function delimit(str) {
        return str.split(' ').join(',');
    }

        // converts ["R","x",D"] to "R,x,D"
    function delimitList(list) {
        let str;
        str = list.join(",")
        return str;
    }

    async function fetchURL(url) {
        // TODO: handle errors
        const response = await fetch(url);
        return await response.json();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    return (
        <div className="wholePage">
            <Navbar />

            <div className="topHalf">

                <QueryForm
                handleTextChange={handleTextChange}
                handleNumberChange={handleNumberChange}
                handleSubmit={handleSubmit}
                handleMovesetClick={handleMovesetClick}
                queryState={queries}/>

                <div className="topRightHalf">
                <Cube
                        scramble={queries.scramble}/>
                </div>

            </div>



            <div className="bottomHalf">
                <div className="innerBottomHalf">
                    <SolutionsDisplay solutionsList={solutionsList}/>
                </div>
            </div>


        </div>
    );
}

export default Solve;

