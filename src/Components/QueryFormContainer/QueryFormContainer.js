import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import MovesetButton from '../MovesetButton/MovesetButton.js';
import UseWindowSize from '../../Utils/Hooks/useWindowSize.js';
import './QueryFormContainer.css';
import { useCallback, useEffect, useMemo } from 'react';

/**
 * This is the form where the user enters information for a solve
 * @param {*}
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
function QueryFormContainer({ handleTextChange, handleNumberChange, handleRandomExample, handleSubmit, handleCancel, handleMovesetClick, queriesState, isSpinner }) {
    //* misc
    // custom hook to dynamically re-render on window size changes
    const windowSize = UseWindowSize();

    // prevents clicking on the icon from focusing inside the input, mostly important for mobile
    useEffect(() => {
        const scrambleIcon = document.querySelector('.scrambleIcon');
        scrambleIcon.addEventListener('click', e => {
            e.preventDefault();
        });
        const depthIcon = document.querySelector('.depthIcon');
        depthIcon.addEventListener('click', e => {
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
        } else if (windowSize.width <= 480) {
            return '[Tap here to enter scramble]';
        } else if (windowSize.width <= 767) {
            return '[Tap here to enter scramble you want to solve]';
        } else if (windowSize.width <= 1025) {
            return '[Tap here to enter scramble]';
        }
        return '[Click here to enter scramble you want to solve]';
    }

    function determineDepthPlaceholderText() {
        if (windowSize.width <= 352) {
            return '[Tap here to enter]';
        } else if (windowSize.width < 480) {
            return '[Tap here to enter max length]';
        } else if (windowSize.width <= 767) {
            return '[Click here to enter maximum algorithm length]';
        } else if (windowSize.width <= 1025) {
            return '[Tap here to enter max length]';
        }
        return '[Click here to enter maximum algorithm length]';
    }

    function determineGeneratingText() { // some leeway is added for different fonts
        if (windowSize.width <= 320) {
            return 'Solving';
        } else if (windowSize.width <= 470) {
            return 'Generating';
        } else if (windowSize.width <= 767) {
            return 'Generating Solutions';
        } else if (windowSize.width <= 1000) {
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

    // creates an entire row of moveset buttons
    const createManyJsxButtons = useCallback((listOfLetters) => {
         const listOfButtons = [];
        for (let letter of listOfLetters) {
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
    // handleMovesetClick only changes if the state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queriesState]);

    // create arrays of JSX buttons
    // The idea is whenever createJSXButtons changes, which only happens when parentState changes, then and only then myButtons will change.
    // And we need myButtons to change when the parentState changes to ensure that each button is correctly receiving the correct isToggled boolean.
    const buttonListFaceMoves = useMemo(() => createManyJsxButtons(['R', 'U', 'D', 'F', 'L', 'B']), [createManyJsxButtons]);
    const buttonListWideMoves = useMemo(() => createManyJsxButtons(['r', 'u', 'd', 'f', 'l', 'b']), [createManyJsxButtons]);
    const buttonListSliceAndRotation = useMemo(() => createManyJsxButtons(['M', 'S', 'E', 'x', 'y', 'z']), [createManyJsxButtons]);

    return (
        // queryFormContainer goes here
        <div className="queryFormContainer">
            <section>

                <label className="scrambleLabel mainText mainColor" htmlFor="scrambleInput">Scramble
                    <div className="iconAndTooltip">
                        <FontAwesomeIcon icon={faCircleInfo} className="scrambleIcon icon mainText" />
                        <div className="scrambleTooltip tooltip accentColor">
                            <p>Enter the scramble you want to solve.</p>
                            <p>Example: R U R' y R' F R U' R' F' R</p>
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

                <label className="mainText mainColor" htmlFor="depthInput">Max Algorithm Length
                    <div className="iconAndTooltip">
                        <FontAwesomeIcon icon={faCircleInfo} className="depthIcon icon mainText" />
                        <div className="depthTooltip tooltip accentColor">
                            <p>Enter the maximum length of solutions the solver should give.</p>
                            <p>Example: 14 means you will receive solutions of at most 14 moves.</p>
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

                <label className="mainText mainColor">Toggle allowed moveset
                    <div className="iconAndTooltip">
                        <FontAwesomeIcon icon={faCircleInfo} className="movesetIcon mainText icon" />
                        <div className="movesetTooltip tooltip accentColor">
                            <p>Enter the move types you want the solutions to be restricted to.</p>
                            <p>Example: if you enter RUD, solutions will at most use those three move types.</p>
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
                    className="bottomButton submitButton mainText secondaryColor"
                    onClick={() => handleSubmit(queriesState)}
                >
                    <p>
                        {isSpinner ?
                            (<>
                                {determineGeneratingText()} <FontAwesomeIcon className="spinner fa-lg" icon={faSpinner} />
                            </>)
                            : 'Solve!'
                        }
                    </p>
                </button>
                <button onClick={() => {
                    handleCancel();
                    }
                }
                    className="bottomButton cancelButton mainText secondaryColor"
                >
                    Cancel
                </button>

                <button onClick={() => {
                    handleRandomExample();
                    }
                }
                    className="bottomButton randomExampleButton mainText secondaryColor"
                >
                    {determineExampleText()}
                </button>
            </section>

        </div>
    );
}

export default QueryFormContainer;