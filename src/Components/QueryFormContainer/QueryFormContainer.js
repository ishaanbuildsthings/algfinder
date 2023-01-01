import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import MovesetButton from './MovesetButton.js';
import UseWindowSize from '../../Hooks/UseWindowSize.js';
import './QueryFormContainer.css';

/**
 * @param {*}
 * handleTextChange - modifies the Solve.js state based on entered scramble text
 * handleNumberChange - modifies the Solve.js state based on entered depth
 * handleSubmit - queries the backend with all the parameters
 * handleMovesetClick - modifies the Solve.js state based on toggled moves
 * queriesState - all of the scramble, depth, and moveset
 * @usage Used in Solve.js
 */
function QueryFormContainer({ handleTextChange, handleNumberChange, handleSubmit, handleMovesetClick, queriesState }) {
    //* misc
    // custom hook to dynamically re-render on window size changes
    let windowSize = UseWindowSize();

    //* helpers
    function determineScramblePlaceholderText() {
        if (windowSize.width <= 352) {
            return '[Tap here to enter]';
        } else if (windowSize.width <= 395) {
            return '[Tap here to enter scramble]';
        } else if (windowSize.width <= 767) {
            return '[Tap here to enter scramble you want to solve]';
        } else if (windowSize.width <= 825) {
            return '[Tap here to enter scramble]';
        }
        return '[Click here to enter scramble you want to solve]';
    }

    function determineDepthPlaceholderText() {
        if (windowSize.width <= 352) {
            return '[Tap here to enter]';
        } else if (windowSize.width <= 395) {
            return '[Tap here to enter max algorithm length]';
        } else if (windowSize.width <= 767) {
            return '[Tap here to enter maximum algorithm length]';
        } else if (windowSize.width <= 825) {
            return '[Tap here to enter max algorithm length]';
        }
        return '[Click here to enter maximum algorithm length]';
    }

    // creates an entire row of moveset buttons
    function createManyJsxButtons(listOfLetters) {
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
    }

    // create arrays of JSX buttons
    const buttonListFaceMoves = createManyJsxButtons(['R', 'U', 'D', 'F', 'L', 'B']);
    const buttonListWideMoves = createManyJsxButtons(['r', 'u', 'd', 'f', 'l', 'b']);
    const buttonListSliceAndRotation = createManyJsxButtons(['M', 'S', 'E', 'x', 'y', 'z']);


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


            <button
                className="submitButton button mainText secondaryColor"
                onClick={() => handleSubmit(queriesState)}
            >
                Show Me Solutions!
            </button>
        </div>
    );
}

export default QueryFormContainer;