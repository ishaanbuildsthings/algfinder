import React from 'react';
import MovesetButton from "../MovesetButton/MovesetButton.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function QueryForm(props) {

    // creates an entire row of moveset buttons
    function createManyJsxButtons(listOfLetters) {
        const listOfButtons = [];
        for (let letter of listOfLetters) {
            listOfButtons.push(
                <MovesetButton
                               value={letter}
                               key={letter} // TODO: why
                               handleMovesetClick={props.handleMovesetClick}
                />
            );
        }
        return listOfButtons;
    }

    const buttonListFaceMoves = createManyJsxButtons(["R", "U", "D", "F", "L", "B"]);
    const buttonListWideMoves = createManyJsxButtons(["r", "u", "d", "f", "l", "b"]);
    const buttonListSliceAndRotation = createManyJsxButtons(["M", "S", "E", "x", "y", "z"]);


    return (
        <div className="queryFormWithSpacing">

            <section className="scramblePanel">

                <label className="label scrambleLabel">Scramble
                    {/* //! <div className="circleIconScrambleDiv"> */}
                        <FontAwesomeIcon icon={faCircleInfo} className="circleIconScramble fa-sm" color="white" />
                        {/* //!<span className="circleIconScrambleTooltip">Test Tooltip Text</span> */}
                    {/* //!</div> */}
                </label>

                <input
                    type="text"
                    placeholder="[Click here to enter scramble you want to solve]"
                    className="scrambleInput interactable"
                    name="scramble"
                    autoComplete="off"
                    value={props.scramble}
                    onChange={props.handleTextChange}

                />

            </section>


            <section className="depthPanel">

                <label className="label">Max Algorithm Length <FontAwesomeIcon icon={faCircleInfo} className="circleIconDepth fa-sm" color="white" /></label>

                <input
                    type="text"
                    placeholder="[Click here to enter maximum algorithm length]"
                    className="depthInput interactable"
                    name="depth"
                    autoComplete="off"
                    value={props.depth}
                    onChange={props.handleNumberChange}
                />
            </section>


            <section className="movePanel">

                <label className="label">Toggle allowed moveset <FontAwesomeIcon icon={faCircleInfo} className="circleIconMoveset fa-sm" color="white" /></label>
                <section className="buttonGrid">
                    {buttonListFaceMoves}
                    {buttonListWideMoves}
                    {buttonListSliceAndRotation}
                </section>

            </section>


            <section>
                <button
                    className="submitButton button interactable"
                    onClick={() => props.handleSubmit(props.queriesState)}
                >
                    Show Me Solutions!
                </button>
            </section>


        </div>
    );
}

export default QueryForm;