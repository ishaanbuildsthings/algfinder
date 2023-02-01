import QueryFormContainer from '../QueryFormContainer/QueryFormContainer.js';
import SolutionsDisplayContainer from '../SolutionsDisplayContainer/SolutionsDisplayContainer.js';
import ErrorPopup from '../ErrorPopup/ErrorPopup.js';
import MovesetPopup from '../MovesetPopup/MovesetPopup.js';
import NoSolutionsModal from '../NoSolutionsModal/NoSolutionsModal.js';
import CubePanel from '../CubePanel/CubePanel.js';
import generateRandomExample from '../../Utils/randomExamples.js';
import mapSolutionsListToDict from '../../Utils/mapSolutionsListToDict.js';
import processMoves from '../../Utils/processMoves.js';
import sortSolutionsDictByMoves from '../../Utils/sortSolutionsDictByMoves.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import './Solve.css';
import '../../Common/Popups.css';
import '../../Common/Tooltips.css';
import '../../Common/animation.css';
let errorMessage = '';

/**
 * The Solve component is a high-level component that maintains state for both the form and the solutions panel
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

    // track the most recently applied alg, to know if we should delay or not for the animation
    const [mostRecentAlg, setMostRecentAlg] = useState('');

    // * other hooks
    const handleMouseDown = useCallback(() => { // memoize for the useEffect
        setNoSolutionsModal(false);
    }, []);

    useEffect(() => {
        if (!isNoSolutionsModal) { // if the popup just turned off, do nothing
            return;
        }
        window.addEventListener('mousedown', handleMouseDown); // if the popup turned on, add an event listener
        return () => {
            window.removeEventListener('mousedown', handleMouseDown); // whenever we turn the popup off a re-render is triggered, running this cleanup function
        };
    // handle mouse down never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNoSolutionsModal]);

    // whenever the component unmounts, kill any active worker via this cleanup function
    useEffect(() => {
        return () => {
            if (workerRef.current !== null) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        // whenever the most recent alg changes, update the cube to have that
        // todo: make not declarative
        const cube = document.querySelector('.mycube');
        cube.alg = mostRecentAlg;
    }, [mostRecentAlg]);

    // * handlers
    // when a user changes the scramble, change the queries state
    const handleTextChange = useCallback((event) => {
        // ! new
        setMostRecentAlg('');

        let { name, value } = event.target;
        value = value.replace(/[‘’]/g, "'"); // replace smart quotes for mobile use
        if (/^[ RUFLDBrufldxyzMSE'2]*$/.test(value) || value === '') {
            setQueries({
                ...queriesState,
                [name]: value
            });
        }
    // clearCube only changes when solve is remounted anyway, so it is not needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queriesState]); // avoid stale states

    // when the user changes the depth, change the queries state
    const handleNumberChange = useCallback((event) => {
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
    }, [queriesState]);

    // when the user clicks on a moveset button, change the queries state to include/exclude that button
    const handleMovesetClick = useCallback((id) => {
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
    }, [queriesState]);


    // e.target.value is the value of whether the stm or qtm sort button was clicked
    const handleClickOnSort = useCallback((e) => {
        const solutionsDict = mapSolutionsListToDict(solutionsList);
        const reorderedList = sortSolutionsDictByMoves(solutionsDict, e.target.value);
        setSolutionsList(reorderedList);
    }, [solutionsList]); // needed to capture new closure

    // workerRef and setter functions don't need to be passed as dependencies since they don't do anything
    const handleSubmit = useCallback(({ scramble, depth, moveset }) => {
        if (workerRef.current) {
            workerRef.current.terminate();
        }

        setMostRecentAlg(''); // when a new alg is submitted, it implies the next solution that is clicked should be ran instantly, rather than after a delay, so re-assign the most recent alg to ''

        // todo: refactor cube to be a ref / custom react component thing

        if (scramble === '') {
            errorMessage = 'Please choose a scramble!';
            setErrorPopup(true);
            return;
        } else if (depth === '') {
            errorMessage = 'Please choose a depth!';
            setErrorPopup(true);
            return;
        } else if (moveset.length === 0) {
            errorMessage = 'Please choose a moveset!';
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
        }

        scramble = processMoves(scramble); // convert bad characters the user enters
        const params = { scramble: scramble, moveset: moveset, depth: depth };
        setSpinner(true);
        setSolutionsList([]);

        // initialize worker
        workerRef.current = new Worker('Workers/SolveWorker.js');
        // if we receive a message from the worker
        const totalSolutions = [];
        workerRef.current.onmessage = (e) => {
            // console.log(`message is: ${e.data}`); for debugging
            if (e.data === 'done') {
                setSpinner(false);
                workerRef.current.terminate();
                workerRef.current = null;
                if (totalSolutions.length === 0) {
                    setNoSolutionsModal(true);
                }
                return;
            } else if (typeof e.data === 'string' && e.data !== 'done') {
                totalSolutions.push(e.data);
                setSolutionsList([...totalSolutions]) // shallow equality is checked
            }
        };
        // fire off the webworker thread with the queries
        workerRef.current.postMessage(params);
    }, []);

    const handleCancel = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            setSpinner(false);
            workerRef.current = null;
        }
    }, []);

    const handleRandomExample = useCallback(() => {
          let data = generateRandomExample();
        while (JSON.stringify(data) === JSON.stringify(queriesState)) {
            data = generateRandomExample();
        }
        setQueries(data);
        handleSubmit(data);
    // handleSubmit never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queriesState]);

    return (
        <div className="solvePageMinusNav">
            <div className="topHalf">
                {isMovesetPopupError && <MovesetPopup killMovesetPopup={() => setMovesetPopupError(false)} />}
                {isErrorPopup && <ErrorPopup errorMessage={errorMessage} killErrorPopup={() => setErrorPopup(false)} />}
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
            <SolutionsDisplayContainer
                handleSort={handleClickOnSort}
                solutionsList={solutionsList}
                mostRecentAlg={mostRecentAlg}
                setMostRecentAlg={setMostRecentAlg}
            />
        </div>
    );
}

export default Solve;
