import { useState } from 'react';
import QueryForm from '../QueryForm/QueryForm.js';
import SolutionsDisplay from '../SolutionsDisplay/SolutionsDisplay.js';
import CubePanel from '../CubePanel/CubePanel.js';
const baseURL = 'http://127.0.0.1:3001';
const pollInterval = 1000; // ms
const VALID_MOVES = new Set('R', 'R2', "R'", 'U', 'U2', "U'", 'D', 'D2', "D'", 'F', 'F2', "F'", 'L', 'L2', "L'", 'B', 'B2', "B'", 'r',
'r2', "r'", 'u', 'u2', "u'", 'd', 'd2', "d'", 'f', 'f2', "f'", 'l', 'l2', "l'", 'b', 'b2', "b'", 'x', 'x2', "x'", 'y', 'y2', "y'", 'z', 'z2', "z'");
const MAX_ALLOWED_MOVESETS = 4;

/**
 * The Solve component defines all of the display unique to the solve section of the website.
 * @usage Used in app.js
 */
function Solve() {
    // * states
    // tracks the current list of solutions, will update via polling
    // @passed to SolutionsDisplay
    const [solutionsList, setSolutionsList] = useState([]);
    // tracks the fields of the query form, data will be sent to the backend
    // @passed to QueryForm and Cube, so that they can display the user-defined data
    const [queriesState, setQueries] = useState({
        scramble: '',
        depth: '',
        moveset: []
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

        if (regex === '') {
            result = '';
        } else {
        result = Math.min(20, regex);
        }
        setQueries({
            ...queriesState,
            [name]: result
        })
    }
    // when the user clicks on a moveset button, change the queries state to include/exclude that button
    function handleMovesetClick(id) {
        if (queriesState.moveset.length >= MAX_ALLOWED_MOVESETS && !queriesState.moveset.includes(id)) {
            alert(`Please select at most ${MAX_ALLOWED_MOVESETS} move types!`);
            return;
        }
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
        const txn_id = await fetchURL(`${baseURL}/solve?scramble=${delimit(scramble)}&max-depth=${depth}&move-types=${delimitList(moveset)}`);
        //console.log(`got txn_id: ${txn_id}`); for debugging

        let solutions = [];
        let keepGoing = true;
        do {
            await sleep(pollInterval);
            solutions = await fetchURL(`${baseURL}/solve-update?txn-id=${txn_id}`);
            //console.log(solns); for debugging
            if (solutions[solutions.length - 1] === 'DONE' && solutionsList.length !== 0) {
                keepGoing = false;
                solutions.pop();
            } else if (solutions[solutions.length - 1] === 'DONE' && solutionsList.length === 0) { // if we hit DONE statement and we don't have any solutions, handle differently
                alert('No solutions exist!');
                return;
            }
            setSolutionsList(previousSolutions => [...previousSolutions, ...solutions]);
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
        str = list.join(',')
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
    function validateQueries() {
        const { scramble, depth, moveset } = queriesState;
        if (moveset.length === 2 && depth > 20) { // should be covered by inability to enter a number higher than 20 in the field
            alert('For 2-gen scrambles, please choose a depth of at most 20');
            return;
        } else if (moveset.length === 3 & depth > 18) {
            alert('For 3-gen scrambles, please choose a depth of at most 18');
            return;
        } else if (moveset.length === 4 & depth > 14) {
            alert('For 4-gen scrambles, please choose a depth of at most 14');
            return;
        } else if (moveset.length > 4) {
            alert('Please choose at most 4 move types'); // redundant function, should be covered since we can't toggle > 4 buttons
            return;
        } else if (moveset.length < 2) {
            alert('Please choose at least 2 move types');
            return;
        }
        validateScramble(scramble);

    }
    // validates scramble input client-side
    function validateScramble(scramble) {
        const arrayScramble = scramble.split(' ');
        for (let move of arrayScramble) {
            if (!VALID_MOVES.has(move)) {
                alert('Please fix your scramble');
                return;
            }
        }
    }

    return (
        <div className="solvePageMinusNav">

            <div className="topHalf">
                <div className="queryFormContainer">
                    <QueryForm
                    handleTextChange={handleTextChange}
                    handleNumberChange={handleNumberChange}
                    handleSubmit={handleSubmit}
                    handleMovesetClick={handleMovesetClick}
                    queriesState={queriesState}
                    />
                </div>

                <CubePanel scramble={queriesState.scramble}/>

            </div>

            <div className="solutionsDisplayContainer">
                <SolutionsDisplay solutionsList={solutionsList}/>
            </div>

        </div>
    );
}

export default Solve;
