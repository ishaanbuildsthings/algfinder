import React from 'react';
import QueryForm from '../Components/QueryForm/QueryForm.js';
import SolutionsDisplay from '../Components/SolutionsDisplay.js';
import Cube from '../Components/Cube.js';
const baseURL = 'http://127.0.0.1:3001';
const pollInterval = 1000; // ms


/**
 * The Solve component defines all of the display unique to the solve section of the website.
 * @usage Used in app.js
 */
function Solve() {
    // * states
    // tracks the current list of solutions, will update via polling
    // @passed to SolutionsDisplay
    const [solutionsList, setSolutionsList] = React.useState([]);
    // tracks the fields of the query form, data will be sent to the backend
    // @passed to QueryForm and Cube, so that they can display the user-defined data
    const [queriesState, setQueries] = React.useState({
        scramble: "",
        moveset: [],
        depth: ""
    });

    // * handlers
    // when a user changes the scramble, change the queries state
    function handleTextChange(event) {
        const {name, value} = event.target;
        setQueries({
            ...queriesState,
            [name]: value
        })
    }
    // when the user changes the depth, change the queries state
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
            ...queriesState,
            [name]: result
        })
    }
    // when the user clicks on a moveset button, change the queries state to include/exclude that button
    function handleMovesetClick(id) {
        if (!queriesState.moveset.includes(id)) {
            setQueries({
                ...queriesState,
                moveset: [...queriesState.moveset, id]
            });
        } else {
            setQueries({
                ...queriesState,
                moveset: queriesState.moveset.filter((element) => element !== id)
            });
        }
    }
    // @passed to the queryForm, which registers this function as an onClick for the submit button
    // when the user clicks the button, send the queries to the backend
    // repeatedly poll the backend for updated data and change the solutions state accordingly
    async function handleSubmit(queries) {
        setSolutionsList([]);
        const {scramble, moveset, depth} = queries;
        // TODO: remove console.log(`${baseURL}/solve?scramble=${delimit(scramble)}&max-depth=${depth}&move-types=${delimitList(moveset)}`);
        const txn_id = await fetchURL(`${baseURL}/solve?scramble=${delimit(scramble)}&max-depth=${depth}&move-types=${delimitList(moveset)}`);
        console.log(`got txn_id: ${txn_id}`); // TODO: remove

        let solns = [];
        let keepGoing = true;
        do {
            await sleep(pollInterval);
            solns = await fetchURL(`${baseURL}/solve-update?txn-id=${txn_id}`);
            console.log(solns); // TODO: remove
            if (solns[solns.length-1] === 'DONE') {
                keepGoing = false;
                solns.pop();
            }
            setSolutionsList(prevSolns => [...prevSolns, ...solns]); // TODO: fix
        } while(keepGoing);
    }

    // * tools, used in making requests to the backend
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
    // converts UL data to JSON
    async function fetchURL(url) {
        // TODO: handle errors
        const response = await fetch(url);
        return await response.json();
    }
    // waits n time
    function sleep(ms) {
        return new Promise((resolve) =>
        {
            setTimeout(resolve, ms);
        });
    }
    // validates scramble input client-side
    function validateScramble(scramble) {
        const arrayScramble = scramble.split(' ');
        for (let i = 0; i < arrayScramble.length; i++) {

        }
    }

    // * jsx
    return (
        <div className="solvePageMinusNav">

            <div className="topHalf">
                <div className="queryFormSpacer">
                    <QueryForm
                    handleTextChange={handleTextChange}
                    handleNumberChange={handleNumberChange}
                    handleSubmit={handleSubmit}
                    handleMovesetClick={handleMovesetClick}
                    queriesState={queriesState}
                    />
                </div>

                <div className="topRightHalf">
                    <Cube scramble={queriesState.scramble}/>
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

