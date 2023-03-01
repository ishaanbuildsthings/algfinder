import { useCallback, useEffect, useRef, useState } from 'react';

import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

import generateRandomExample from '../../utils/randomExamples.js';
import { joyrideCanSolveSteps, joyrideCannotSolveSteps } from '../../utils/joyride.js';
import mapSolutionsListToDict from '../../utils/mapSolutionsListToDict.js';
import processMoves from '../../utils/processMoves.js';
import sortSolutionsDictByMoves from '../../utils/sortSolutionsDictByMoves.js';

import CubePanel from '../CubePanel/CubePanel.js';
import ErrorPopup from '../ErrorPopup/ErrorPopup.js';
import LandingModal from '../LandingModal/LandingModal.js';
import MovesetPopup from '../MovesetPopup/MovesetPopup.js';
import NoSolutionsModal from '../NoSolutionsModal/NoSolutionsModal.js';
import QueryFormContainer from '../QueryFormContainer/QueryFormContainer.js';
import SolutionsDisplayContainer from '../SolutionsDisplayContainer/SolutionsDisplayContainer.js';

import '../../commonCss/popups.css';
import '../../commonCss/tooltips.css';
import '../../commonCss/animation.css';
import './Solve.css';

let errorMessage = '';

/**
 * The Solve component is a high-level component that maintains state for both the form and the solutions panel
 * @usage Used in App.js
 */
export default function Solve({ solveComponentMountedMoreThanOnce }) {
    // * states
    // tracks the current list of solutions, passed to solutionsDisplay
    const [solutionsList, setSolutionsList] = useState([]);
    // tracks the fields of the query form, passed to QueryForm and Cube, so that they can display the user-defined data
    const [queriesState, setQueries] = useState({
        scramble: '',
        depth: '',
        moveset: []
    });
    // for the product tour
    const [canSolveCube, setCanSolveCube] = useState(false);
    const [cannotSolveCube, setCannotSolveCube] = useState(false);
    const [runJoyride, setRunJoyride] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    // conditional renders
    const [isErrorPopup, setErrorPopup] = useState(false);
    const [isMovesetPopupError, setMovesetPopupError] = useState(false);
    const [isNoSolutionsModal, setNoSolutionsModal] = useState(false);
    const [isSpinner, setSpinner] = useState(false);
    // track the most recently applied alg, to know if we should delay or not for the animation
    const [mostRecentAlg, setMostRecentAlg] = useState('');

    // * refs
    const workerRef = useRef(null); // initially the ref points to no worker, we store the worker inside a ref so even when the component re-renders, we can terminate the correct worker
    const joyrideRef = useRef(null); // the joyride is stored in a ref so that we can make the joyride move to the next step via the handleNextClick function

    // * useEffects
    // whenever the component mounts, increment a counter by one, and only render the joyride if the count is 1
    useEffect(() => {
        solveComponentMountedMoreThanOnce.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const cube = document.querySelector('.cube');
        cube.alg = mostRecentAlg;
    }, [mostRecentAlg]);

    // * functions
    const handleMouseDown = useCallback(() => { // memoize for the useEffect
        setNoSolutionsModal(false);
    }, []);

    // when a user changes the scramble, change the queries state
    const handleTextChange = useCallback((event) => {
        setMostRecentAlg(''); // when the user starts typing a new scramble, it implies they will generate new solutions, so set the most recent alg to be blank to allow for an immediate animation on the next run

        let { name, value } = event.target;
        value = value.replace(/[‘’]/g, "'"); // replace smart quotes for mobile use
        if (/^[ RUFLDBrufldxyzMSE'2]*$/.test(value) || value === '') {
            setQueries({
                ...queriesState,
                [name]: value
            });
        }
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
        if (depth === '') {
            errorMessage = 'Please choose a depth!';
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
        workerRef.current = new Worker('workers/solveWorker.js');
        // if we receive a message from the worker
        const totalSolutions = [];
        workerRef.current.onmessage = (e) => {
            // console.log(`message is: ${e.data}`); // for debugging
            // if (e.data.slice(0, 1) === '~') {
            //     return;
            // } // for debugging
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
        setMostRecentAlg(''); // when a new alg is submitted, it implies the next solution that is clicked should be ran instantly, rather than after a delay, so re-assign the most recent alg to ''
    }, [queriesState]);

    // run determines if the joyride is running, and active step refers to the step of the joyride
    // The handleJoyrideCallback function is called whenever a step is completed or skipped, and sets run and activeStep back to their initial values when the joyride is finished or skipped.
    const handleJoyrideCallback = useCallback((data) => {
        const { status } = data;
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setRunJoyride(false);
            setCanSolveCube(false);
        }
    }, []);

    return (
        <div className="solvePageMinusNav">
            {!solveComponentMountedMoreThanOnce.current && (
                <LandingModal
                    handleCanSolveCube={() => {
                        setCanSolveCube(true); // renders the can solve cube joyride
                        setRunJoyride(true); // sets the joyride to be running
                    }}
                handleCannotSolveCube={() => setCannotSolveCube(true)}
            />
            )}
            {canSolveCube && (<Joyride
                steps={joyrideCanSolveSteps}
                run={runJoyride}
                activeStep={activeStep}
                callback={handleJoyrideCallback}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                ref={joyrideRef}
                styles={{
                    options: {
                        primaryColor: '#3030e8'
                    },
                    buttonNext: {
                        letterSpacing: '0.7px'
                    }
                }}
            />)}
            {cannotSolveCube && (<Joyride
                steps={joyrideCannotSolveSteps}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                styles={{
                    options: {
                        primaryColor: '#3030e8'
                    },
                    buttonNext: {
                        letterSpacing: '0.7px'
                    }
                }}
            />)}
            <div className="topHalf">
                {isMovesetPopupError &&
                    <MovesetPopup
                        killMovesetPopup={() => setMovesetPopupError(false)}
                    />
                }
                {isErrorPopup &&
                    <ErrorPopup
                        errorMessage={errorMessage}
                        killErrorPopup={() => setErrorPopup(false)}
                    />}
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
            <button onClick={handleNextClick}>click me to roceed</button>
            <SolutionsDisplayContainer
                handleSort={handleClickOnSort}
                solutionsList={solutionsList}
                mostRecentAlg={mostRecentAlg}
                setMostRecentAlg={setMostRecentAlg}
            />
        </div>
    );
};
