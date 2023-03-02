/* eslint-disable jsx-a11y/label-has-associated-control */
import { useCallback, useEffect, useMemo } from 'react';

import { faCircleInfo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useWindowSize from '../../utils/hooks/useWindowSize.js';

import MovesetButton from '../MovesetButton/MovesetButton.js';

import './QueryFormContainer.css';

/**
 * This is the form in which the user enters information for a solve
 * @param
 * handleTextChange - modifies the Solve.js state based on entered scramble text
 * handleNumberChange - modifies the Solve.js state based on entered depth
 * handleRandomExample - modifies the Solve.js queriesState with a randomly generated example
 * handleSubmit - runs the solve function with parameters, or queries the backend if implemented with the cloud
 * handleCancel - cancels the computation from the submit function
 * handleMovesetClick - modifies the Solve.js state based on toggled moves
 * queriesState - all of the scramble, depth, and moveset
 * isSpinner - the statee if the spinner should show
 * @usage Used in Solve.js
 */
export default function QueryFormContainer({
  handleTextChange,
  handleNumberChange,
  handleRandomExample,
  handleSubmit,
  handleCancel,
  handleMovesetClick,
  queriesState,
  isSpinner,
}) {
  //* custom hooks
  // custom hook to dynamically re-render on window size changes
  const windowSize = useWindowSize();

  // * useEffects
  // prevents clicking on the icon from focusing inside the input, mostly important for mobile
  useEffect(() => {
    const scrambleIcon = document.querySelector('.scrambleIcon');
    scrambleIcon.addEventListener('click', (e) => {
      e.preventDefault();
    });
    const depthIcon = document.querySelector('.depthIcon');
    depthIcon.addEventListener('click', (e) => {
      e.preventDefault();
    });
    return () => {
      scrambleIcon.removeEventListener('click', (e) => {
        e.preventDefault();
      });
      depthIcon.removeEventListener('click', (e) => {
        e.preventDefault();
      });
    };
  }, []);

  //* helpers
  // these helpers change what text shows based on the screen size
  function determineScramblePlaceholderText() {
    if (windowSize.width <= 352) {
      return '[Tap here to enter]';
    }
    if (windowSize.width <= 480) {
      return '[Tap here to enter scramble]';
    }
    if (windowSize.width <= 767) {
      return '[Tap here to enter scramble you want to solve]';
    }
    if (windowSize.width <= 1025) {
      return '[Tap here to enter scramble]';
    }
    return '[Click here to enter scramble you want to solve]';
  }

  function determineDepthPlaceholderText() {
    if (windowSize.width <= 352) {
      return '[Tap here to enter]';
    }
    if (windowSize.width < 480) {
      return '[Tap here to enter max length]';
    }
    if (windowSize.width <= 767) {
      return '[Click here to enter maximum algorithm length]';
    }
    if (windowSize.width <= 1025) {
      return '[Tap here to enter max length]';
    }
    return '[Click here to enter maximum algorithm length]';
  }

  function determineGeneratingText() {
    // some leeway is added for different fonts
    if (windowSize.width <= 320) {
      return 'Solving';
    }
    if (windowSize.width <= 470) {
      return 'Generating';
    }
    if (windowSize.width <= 767) {
      return 'Generating Solutions';
    }
    if (windowSize.width <= 1000) {
      return 'Generating';
    }
    return 'Generating Solutions';
  }

  function determineExampleText() {
    if (windowSize.width <= 360) {
      return 'Random Example';
    }
    return 'Try a Random Example';
  }

  // * functions
  // creates an entire row of moveset buttons
  const createManyJsxButtons = useCallback(
    (listOfLetters) => {
      const listOfButtons = [];
      for (const letter of listOfLetters) {
        listOfButtons.push(
          <MovesetButton
            value={letter}
            key={letter}
            handleMovesetClick={handleMovesetClick}
            isToggled={queriesState.moveset.includes(letter)}
          />
        );
      }
      return listOfButtons;
    },
    // handleMovesetClick only changes if the state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queriesState]
  );

  // * useMemos
  // create arrays of JSX buttons
  // The idea is whenever createJSXButtons changes, which only happens when parentState changes, then and only then myButtons will change.
  // And we need myButtons to change when the parentState changes to ensure that each button is correctly receiving the correct isToggled boolean.
  const buttonListFaceMoves = useMemo(
    () => createManyJsxButtons(['R', 'U', 'D', 'F', 'L', 'B']),
    [createManyJsxButtons]
  );
  const buttonListWideMoves = useMemo(
    () => createManyJsxButtons(['r', 'u', 'd', 'f', 'l', 'b']),
    [createManyJsxButtons]
  );
  const buttonListSliceAndRotation = useMemo(
    () => createManyJsxButtons(['M', 'S', 'E', 'x', 'y', 'z']),
    [createManyJsxButtons]
  );

  return (
    // queryFormContainer goes here
    <div className="queryFormContainer">
      <section>
        <label
          className="scrambleLabel mainText mainColor"
          htmlFor="scrambleInput"
        >
          Scramble
          <div className="iconAndTooltip">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="scrambleIcon icon mainText"
            />
            <div className="scrambleTooltip tooltip accentColor">
              <p>Enter the scramble you want to solve.</p>
              <p>Example: R2 U R U R' U' R' U' R' U R'</p>
            </div>
          </div>
        </label>

        <input
          id="scrambleInput"
          type="text"
          placeholder={determineScramblePlaceholderText()}
          className="secondaryColor mainText"
          name="scramble"
          autoComplete="off"
          value={queriesState.scramble}
          onChange={handleTextChange}
        />
      </section>

      <section>
        <label className="mainText mainColor" htmlFor="depthInput">
          Max Algorithm Length
          <div className="iconAndTooltip">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="depthIcon icon mainText"
            />
            <div className="depthTooltip tooltip accentColor">
              <p>
                Enter the maximum length of solutions the solver should give.
              </p>
              <p>
                Example: 14 means you will receive solutions of at most 14
                moves.
              </p>
            </div>
          </div>
        </label>

        <input
          id="depthInput"
          type="text"
          placeholder={determineDepthPlaceholderText()}
          className="secondaryColor mainText"
          name="depth"
          autoComplete="off"
          value={queriesState.depth}
          onChange={handleNumberChange}
        />
      </section>

      <section>
        <label className="mainText mainColor">
          Toggle allowed moveset
          <div className="iconAndTooltip">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="movesetIcon mainText icon"
            />
            <div className="movesetTooltip tooltip accentColor">
              <p>
                Enter the move types you want the solutions to be restricted to.
              </p>
              <p>
                Example: if you enter RUD, solutions will at most use those
                three move types.
              </p>
            </div>
          </div>
        </label>
        <div className="buttonGrid">
          {buttonListFaceMoves}
          {buttonListWideMoves}
          {buttonListSliceAndRotation}
        </div>
      </section>

      <section className="submitAndCancelAndRandom">
        {/* in safari this button is bugged as flexbox on buttons is calculated wrong */}
        <button
          type="button"
          className="bottomButton submitButton mainText secondaryColor"
          onClick={() => handleSubmit(queriesState)}
        >
          <p>
            {isSpinner ? (
              <>
                {determineGeneratingText()}{' '}
                <FontAwesomeIcon className="spinner fa-lg" icon={faSpinner} />
              </>
            ) : (
              'Show Me Solutions!'
            )}
          </p>
        </button>
        <button
          type="button"
          onClick={() => {
            handleCancel();
          }}
          className="bottomButton cancelButton mainText secondaryColor"
        >
          Cancel Solve
        </button>

        <button
          type="button"
          onClick={() => {
            handleRandomExample();
          }}
          className="bottomButton randomExampleButton mainText secondaryColor"
        >
          {determineExampleText()}
        </button>
      </section>
    </div>
  );
}
