import QueryFormContainer from '../QueryFormContainer/QueryFormContainer.js';
import SolutionsDisplayContainer from '../SolutionsDisplayContainer/SolutionsDisplayContainer.js';
import ErrorPopup from '../ErrorPopup/ErrorPopup.js';
import MovesetPopup from '../MovesetPopup.js/MovesetPopup.js';
import NoSolutionsModal from '../NoSolutionsModal/NoSolutionsModal.js';
import CubePanel from '../CubePanel/CubePanel.js';
import { useState, useEffect } from 'react';
import processMoves from '../../processMoves.js';
import './Solve.css';
const baseURL = 'http://127.0.0.1:3001';
const pollInterval = 1000; // ms
let errorMessage = '';

async function fetchURL(url) {
    // TODO: handle errors
    const response = await fetch(url);
    return await response.json();
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

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
    // used to conditionally render ErrorPopup
    const [isErrorPopup, setErrorPopup] = useState(false);
    // used to conditionally render MovesetPopup
    const [isMovesetPopupError, setMovesetPopupError] = useState(false);
    // used to conditionally render the NoSolutionsModal
    const [isNoSolutionsModal, setNoSolutionsModal] = useState(false);
    // used to conditionally render the spinner icon, at this level so it can be handled inside handleSubmit function
    const [isSpinner, setSpinner] = useState(false);

    // * other hooks
    useEffect(() => {
        window.addEventListener('click', () => setNoSolutionsModal(false));

        return () => {
            window.removeEventListener('click', () => setNoSolutionsModal(false));
        };
    }, [isNoSolutionsModal])
    // TODO

    // * handlers
    // when a user changes the scramble, change the queries state
    function handleTextChange(event) {
        const { name, value } = event.target;
        if (/^([rludfbRLUDFBMSExyz]['2]? ?)+$/.test(value) || value === '') {
            setQueries({
                ...queriesState,
                [name]: value
            })
        }
    }
    // when the user changes the depth, change the queries state
    function handleNumberChange(event) {
        const { name, value } = event.target;
        if (value === '') {
            setQueries({
                ...queriesState,
                [name]: value
            })
        } else if (/^[0123456789]+$/.test(value)) {
            setQueries({
                ...queriesState,
                [name]: Math.min(20, value)
            })
        }
    }
    // when the user clicks on a moveset button, change the queries state to include/exclude that button
    function handleMovesetClick(id) {
        if (queriesState.moveset.length >= 4 && !queriesState.moveset.includes(id)) {
            setMovesetPopupError(true);
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
    async function handleSubmit({ scramble, depth, moveset }) {
        if (scramble.length < 2) {
            errorMessage = 'Please enter a valid scramble';
            setErrorPopup(true);
            return;
        } else if (depth === 1 || depth === '') {
            errorMessage = 'Please choose a depth of at least 2';
            setErrorPopup(true);
            return;
        } else if (moveset.length === 3 & depth > 18) {
            errorMessage = 'For 3-gen scrambles, please choose a depth of at most 18';
            setErrorPopup(true);
            return;
        } else if (moveset.length === 4 & depth > 14) {
            errorMessage = 'For 4-gen scrambles, please choose a depth of at most 14';
            setErrorPopup(true);
            return;
        } else if (moveset.length < 2) {
            errorMessage = 'Please choose at least 2 move types';
            setErrorPopup(true);
            return;
        }

        setSolutionsList([]);
        setSpinner(true);
        console.log(processMoves(scramble))
        const txn_id = await fetchURL(`${baseURL}/solve?scramble=${processMoves(scramble).trim().split(' ').join(',')}&max-depth=${depth}&move-types=${moveset.join(',')}`);
        console.log(`got txn_id: ${txn_id}`); //for debugging

        let solutions = []; // solutions is the new diff we receive from backend
        let allLocalSolutions = [];
        let keepGoing = true;
        do {
            await sleep(pollInterval);
            solutions = await fetchURL(`${baseURL}/solve-update?txn-id=${txn_id}`); // the new diff
            allLocalSolutions = [...allLocalSolutions, ...solutions]; // memo solutions will keep adding new diffs, tracking the current solutions in local context
            if (solutions[solutions.length - 1] === 'DONE') { // if the last id from the diff is 'DONE', we have hit the end
                keepGoing = false;
                allLocalSolutions.pop();
                if (allLocalSolutions.length === 0) { // if we receive 'DONE', and the diff only contains that, we have no solutions
                    setNoSolutionsModal(true);
                }
            }
            setSolutionsList(allLocalSolutions);
        } while (keepGoing);
        setSpinner(false);
    }

    return (
        <div className="solvePageMinusNav">
            <div className="topHalf">
                {isMovesetPopupError && <MovesetPopup setMovesetPopup={setMovesetPopupError} />}
                {isErrorPopup && <ErrorPopup errorMessage={errorMessage} setErrorPopup={setErrorPopup} />}
                {isNoSolutionsModal && <NoSolutionsModal />}
                <QueryFormContainer
                    handleTextChange={handleTextChange}
                    handleNumberChange={handleNumberChange}
                    handleSubmit={handleSubmit}
                    handleMovesetClick={handleMovesetClick}
                    queriesState={queriesState}
                    isSpinner={isSpinner}
                />
                <CubePanel scramble={queriesState.scramble} />
            </div>
            <SolutionsDisplayContainer solutionsList={solutionsList} />
        </div>
    );
}

export default Solve;
