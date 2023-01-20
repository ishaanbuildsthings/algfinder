import QueryFormContainer from '../QueryFormContainer/QueryFormContainer.js';
import SolutionsDisplayContainer from '../SolutionsDisplayContainer/SolutionsDisplayContainer.js';
import ErrorPopup from '../ErrorPopup/ErrorPopup.js';
import MovesetPopup from '../MovesetPopup/MovesetPopup.js';
import NoSolutionsModal from '../NoSolutionsModal/NoSolutionsModal.js';
import CubePanel from '../CubePanel/CubePanel.js';
import processMoves from '../../Utils/processMoves.js';
import generateRandomExample from '../../Utils/randomExamples.js';
import { useEffect, useRef, useState } from 'react';
import './Solve.css';
import '../../Common/Popups.css';
import '../../Common/Tooltips.css';
import '../../Common/animation.css';
let errorMessage = '';

/**
 * The Solve component defines all of the display unique to the solve section of the website.
 * @usage Used in app.js
 */
function Solve() {
    const workerRef = useRef(null); // initially the ref points to no worker

    // * states
    // tracks the current list of solutions, passed to solutionsDisplay
    const [solutionsList, setSolutionsList] = useState([]);
    // tracks the fields of the query form
    // passed to QueryForm and Cube, so that they can display the user-defined data
    const [queriesState, setQueries] = useState({
        scramble: '',
        depth: '',
        moveset: []
    });
    // conditional renders
    const [isErrorPopup, setErrorPopup] = useState(false);
    const [isMovesetPopupError, setMovesetPopupError] = useState(false);
    const [isNoSolutionsModal, setNoSolutionsModal] = useState(false);
    const [isSpinner, setSpinner] = useState(false);

    // * other hooks
    useEffect(() => {
        window.addEventListener('mousedown', () => setNoSolutionsModal(false));

        return () => {
            window.removeEventListener('mousedown', () => setNoSolutionsModal(false));
        };
    }, [isNoSolutionsModal])
    // TODO:

    // whenever the component unmounts, kill any active worker
    useEffect(() => {
        return () => {
            if (workerRef.current !== null) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        }
    }, []);


    // * handlers
    function handleRandomExample() {
        let data = generateRandomExample();
        while (JSON.stringify(data) === JSON.stringify(queriesState)) {
            data = generateRandomExample();
        }
        setQueries(data);
        handleSubmit(data);
    }

    // when a user changes the scramble, change the queries state
    function handleTextChange(event) {
        const { name, value } = event.target;
        if (/^[ RUFLDBrufldxyzMSE'2]*$/.test(value) || value === '') {
            setQueries({
                ...queriesState,
                [name]: value
            });
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

    function handleSubmit({ scramble, depth, moveset }) {
        if (workerRef.current) {
            workerRef.current.terminate();
        }

        // TODO: remove some handling, check if scramble length 1 works
        if (depth === 1 || depth === '') {
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

        scramble = processMoves(scramble);
        const params = { scramble: scramble, moveset: moveset, depth: depth }
        setSpinner(true);
        setSolutionsList([]);

        // initialize
        workerRef.current = new Worker('Workers/SolveWorker.js', {type: 'module'});
        // if we receive a message from the worker
        const totalSolutions = [];
        workerRef.current.onmessage = (e) => {
            // ! todo
            console.log(`message is: ${e.data}`);
            if (e.data === 'done') {
                setSpinner(false);
                workerRef.current.terminate();
                workerRef.current = null;
                if (totalSolutions.length === 0) {
                    setNoSolutionsModal(true);
                }
                return;
            } else if (typeof e.data === 'string' && e.data !== 'done') {
                console.log(e.data);
                return;
                totalSolutions.push(e.data);
                console.log(totalSolutions);
                setSolutionsList([...totalSolutions]) // shallow equality is checked
            }
        };

        // fire off the webworker thread with the queries
        workerRef.current.postMessage(params);
    }
    // todo: scramble = x, movetypes = R, depth = 12, a solution of R' is found?

    function handleCancel() {
        if (workerRef.current) {
            workerRef.current.terminate();
            setSpinner(false);
            workerRef.current = null;
        }
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
                    handleRandomExample={handleRandomExample}
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
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
