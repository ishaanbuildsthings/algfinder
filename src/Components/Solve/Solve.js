import { useCallback, useEffect, useRef, useState } from 'react';

import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

import generateRandomExample from '../../utils/randomExamples.js';
import {
  joyrideCanSolveSteps,
  joyrideCannotSolveSteps,
} from '../../utils/joyride.js';
import mapSolutionsListToDict from '../../utils/mapSolutionsListToDict.js';
import processMoves from '../../utils/processMoves.js';
import sortSolutionsDictByMoves from '../../utils/sortSolutionsDictByMoves.js';
import useLocalStorage from '../../utils/hooks/useLocalStorage.js';

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

const CANNOT_SOLVE_CUBE_RANDOM_EXAMPLE_STEP = 0;
const CANNOT_SOLVE_CUBE_SUBMIT_STEP = 4;
const CANNOT_SOLVE_CUBE_ANIMATE_STEP = 5;

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
    moveset: [],
  });
  // tracks any error messages for a popup error
  const [errorMessage, setErrorMessage] = useState('');
  // for the product tour
  const [solveCubeJoyrideShowing, setSolveCubeJoyrideShowing] = useState(false);
  const [cannotSolveCubeJoyrideShowing, setCannotSolveCubeJoyrideShowing] =
    useState(false);
  const [solveCubeJoyrideRunning, setSolveCubeJoyrideRunning] = useState(false);
  const [cannotSolveCubeJoyrideRunning, setCannotSolveCubeJoyrideRunning] =
    useState(false);
  const [solveCubeStepIndex, setSolveCubeStepIndex] = useState(0);
  const [cannotSolveCubeStepIndex, setCannotSolveCubeStepIndex] = useState(0);
  // conditional renders
  const [isErrorPopup, setErrorPopup] = useState(false);
  const [isMovesetPopupError, setMovesetPopupError] = useState(false);
  const [isNoSolutionsModal, setNoSolutionsModal] = useState(false);
  const [isSpinner, setSpinner] = useState(false);
  // tracks whether the dialog modal should be shown in the future
  const [dialogLocalStorage, setDialogStateAndLocalStorage] = useLocalStorage(
    'dialog',
    true
  );
  // track the most recently applied alg, to know if we should delay or not for the animation
  const [mostRecentAlg, setMostRecentAlg] = useState('');

  // * refs
  const workerRef = useRef(null); // initially the ref points to no worker, we store the worker inside a ref so even when the component re-renders, we can terminate the correct worker

  // * useEffects
  // whenever the component mounts, update a ref to be true, this makes it so when you go to the FAQ and return to the homepage, the joyrides don't show up again
  useEffect(() => {
    solveComponentMountedMoreThanOnce.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // whenever the "no solutions found" modal appears, add an event listener to clear it
  useEffect(() => {
    if (!isNoSolutionsModal) {
      // if the popup just turned off, do nothing
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
  useEffect(
    () => () => {
      if (workerRef.current !== null) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    },
    []
  );

  // whenever the most recent alg changes, update the cube to have that alg
  useEffect(() => {
    const cube = document.querySelector('.cube');
    cube.alg = mostRecentAlg;
  }, [mostRecentAlg]);

  // * functions
  const handleMouseDown = useCallback(() => {
    // memoize for the useEffect
    setNoSolutionsModal(false);
  }, []);

  // when a user changes the scramble, change the queries state
  const handleTextChange = useCallback(
    (event) => {
      setMostRecentAlg(''); // when the user starts typing a new scramble, it implies they will generate new solutions, so set the most recent alg to be blank to allow for an immediate animation on the next run

      let { name, value } = event.target;
      value = value.replace(/[‘’]/g, "'"); // replace smart quotes for mobile use
      if (/^[ RUFLDBrufldxyzMSE'2]*$/.test(value) || value === '') {
        setQueries({
          ...queriesState,
          [name]: value,
        });
      }
    },
    [queriesState]
  ); // avoid stale states

  // when the user changes the depth, change the queries state
  const handleNumberChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      if (value === '') {
        setQueries({
          ...queriesState,
          [name]: value,
        });
      } else if (/^[0123456789]+$/.test(value)) {
        setQueries({
          ...queriesState,
          [name]: Math.min(20, value),
        });
      }
    },
    [queriesState]
  );

  // when the user clicks on a moveset button, change the queries state to include/exclude that button
  const handleMovesetClick = useCallback(
    (id) => {
      if (
        queriesState.moveset.length >= 4 &&
        !queriesState.moveset.includes(id)
      ) {
        setMovesetPopupError(true);
        return;
      }
      if (!queriesState.moveset.includes(id)) {
        setQueries({
          ...queriesState,
          moveset: [...queriesState.moveset, id],
        });
      } else {
        setQueries({
          ...queriesState,
          moveset: queriesState.moveset.filter((element) => element !== id),
        });
      }
    },
    [queriesState]
  );

  // whenever a sort button is clicked, sort the solutions appropriately
  // e.target.value is the value of whether the stm or qtm sort button was clicked
  const handleClickOnSort = useCallback(
    (e) => {
      const solutionsDict = mapSolutionsListToDict(solutionsList);
      const reorderedList = sortSolutionsDictByMoves(
        solutionsDict,
        e.target.value
      );
      setSolutionsList(reorderedList);
    },
    [solutionsList]
  ); // needed to capture new closure

  // when the submit button is clicked, run the worker, start the loading icon, and reset the most recently applied alg
  // workerRef and setter functions don't need to be passed as dependencies since they don't do anything
  const handleSubmit = useCallback(
    ({ scramble, depth, moveset }) => {
      // if we are in the controlled joyride at the submit step, proceed in the joyride
      if (cannotSolveCubeStepIndex === CANNOT_SOLVE_CUBE_SUBMIT_STEP) {
        setCannotSolveCubeStepIndex(cannotSolveCubeStepIndex + 1);
      }
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      setMostRecentAlg(''); // when a new alg is submitted, it implies the next solution that is clicked should be ran instantly, rather than after a delay, so re-assign the most recent alg to ''
      if (depth === '') {
        setErrorMessage('Please choose a depth!');
        setErrorPopup(true);
        return;
      }
      if (moveset.length === 3 && depth > 18) {
        setErrorMessage(
          'For scrambles of 3 moves, please choose a depth of at most 18.'
        );
        setErrorPopup(true);
        return;
      }
      if (moveset.length === 4 && depth > 14) {
        setErrorMessage(
          'For scrambles of 4 moves, please choose a depth of at most 14.'
        );
        setErrorPopup(true);
        return;
      }
      const processedScramble = processMoves(scramble); // remove bad characters the user enters
      const params = { processedScramble, moveset, depth };
      setSpinner(true);
      setSolutionsList([]);
      // initialize worker
      workerRef.current = new Worker('workers/solveWorker.js');
      // if we receive a message from the worker
      const totalSolutions = [];
      workerRef.current.onmessage = (e) => {
        // console.log(`message is: ${e.data}`); // for debugging
        // if (e.data.slice(0, 1) === '~') {
        //   return;
        // } // for debugging
        if (e.data === 'done') {
          setSpinner(false);
          workerRef.current.terminate();
          workerRef.current = null;
          if (totalSolutions.length === 0) {
            setNoSolutionsModal(true);
          }
        } else if (typeof e.data === 'string' && e.data !== 'done') {
          totalSolutions.push(e.data);
          setSolutionsList([...totalSolutions]); // shallow equality is checked
        }
      };
      // fire off the webworker thread with the queries
      workerRef.current.postMessage(params);
    },
    [cannotSolveCubeStepIndex]
  );

  const handleCancel = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      setSpinner(false);
      workerRef.current = null;
    }
  }, []);

  const handleRandomExample = useCallback(() => {
    // if we are at the random example step
    if (cannotSolveCubeStepIndex === CANNOT_SOLVE_CUBE_RANDOM_EXAMPLE_STEP) {
      setCannotSolveCubeStepIndex(cannotSolveCubeStepIndex + 1);
    }
    let data = generateRandomExample();
    while (JSON.stringify(data) === JSON.stringify(queriesState)) {
      data = generateRandomExample();
    }
    setQueries(data);
    setMostRecentAlg(''); // when a new alg is submitted, it implies the next solution that is clicked should be ran instantly, rather than after a delay, so re-assign the most recent alg to ''
  }, [queriesState, cannotSolveCubeStepIndex]);

  // creates joyride callback functions using the reusable logic
  const createHandleJoyrideCallback = useCallback(
    (setter, setJoyrideShowing) => (data) => {
      const { action, index, status, type } = data;
      if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
        // console.log("🚀 | handleJoyrideCallback | data", data); // for debugging
        setter(index + (action === ACTIONS.PREV ? -1 : 1));
      } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
        setJoyrideShowing(false);
      }
    },
    []
  );
  // These functions are called every time the joyride proceeds one step
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSolveCubeJoyrideCallback = useCallback(
    createHandleJoyrideCallback(
      setSolveCubeStepIndex,
      setSolveCubeJoyrideShowing
    ),
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCannotSolveCubeJoyrideCallback = useCallback(
    createHandleJoyrideCallback(
      setCannotSolveCubeStepIndex,
      setCannotSolveCubeJoyrideShowing
    ),
    []
  );

  // this function is called on every step of the joyride
  const proceedToNextStepCannotSolveJoyride = useCallback(() => {
    // if we are at the animate step
    if (cannotSolveCubeStepIndex === CANNOT_SOLVE_CUBE_ANIMATE_STEP) {
      setCannotSolveCubeStepIndex(cannotSolveCubeStepIndex + 1);
    }
  }, [cannotSolveCubeStepIndex]);

  return (
    <div className="solvePageMinusNav">
      {!solveComponentMountedMoreThanOnce.current &&
        dialogLocalStorage !== 'false' && (
          <LandingModal
            dontShowDialogAgain={() => setDialogStateAndLocalStorage(false)}
            handleCanSolveCube={() => {
              setSolveCubeJoyrideRunning(true);
              setSolveCubeJoyrideShowing(true); // renders the can solve cube joyride
            }}
            handleCannotSolveCube={() => {
              setCannotSolveCubeJoyrideRunning(true);
              setCannotSolveCubeJoyrideShowing(true);
            }}
          />
        )}
      {solveCubeJoyrideShowing && (
        <Joyride
          disableOverlayClose
          steps={joyrideCanSolveSteps}
          callback={handleSolveCubeJoyrideCallback}
          continuous
          showProgress
          showSkipButton
          run={solveCubeJoyrideRunning}
          stepIndex={solveCubeStepIndex}
          styles={{
            options: {
              primaryColor: '#3030e8',
            },
            buttonNext: {
              letterSpacing: '0.7px',
            },
          }}
        />
      )}
      {cannotSolveCubeJoyrideShowing && (
        <Joyride
          disableOverlayClose
          steps={joyrideCannotSolveSteps}
          callback={handleCannotSolveCubeJoyrideCallback}
          continuous
          showProgress
          showSkipButton
          run={cannotSolveCubeJoyrideRunning}
          stepIndex={cannotSolveCubeStepIndex}
          styles={{
            options: {
              primaryColor: '#3030e8',
            },
            buttonNext: {
              letterSpacing: '0.7px',
            },
          }}
        />
      )}
      <div className="topHalf">
        {isMovesetPopupError && (
          <MovesetPopup killMovesetPopup={() => setMovesetPopupError(false)} />
        )}
        {isErrorPopup && (
          <ErrorPopup
            errorMessage={errorMessage}
            killErrorPopup={() => setErrorPopup(false)}
          />
        )}
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
        proceedToNextStepCannotSolveJoyride={
          proceedToNextStepCannotSolveJoyride
        }
      />
    </div>
  );
}
