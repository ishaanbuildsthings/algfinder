import React from 'react';
import MovesetButton from "./MovesetButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function QueryForm(props) {

    // creates an entire row of moveset buttons
    function createManyJsxButtons(listOfLetters) {
        const listOfButtons = [];
        for (let letter of listOfLetters) {
            listOfButtons.push(
                <MovesetButton
                               name={letter}
                               value={letter}
                               id={letter}
                               changeMove={props.handleMovesetClick}
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

                <label className="label scrambleLabel">Scramble <FontAwesomeIcon icon={faCircleInfo} className="circleIconScramble fa-sm" color="white" />
</label>

                <input
                    type="text"
                    placeholder="[Click here to enter scramble you want to solve]"
                    className="scrambleInput interactable"
                    name="scramble"
                    autoComplete="off"
                    value={props.queryState.scramble}
                    onChange={props.handleTextChange}

                />

            </section>


            <section className="depthPanel">

                <label className="label">Depth <FontAwesomeIcon icon={faCircleInfo} className="circleIconScramble fa-sm" color="white" /></label>

                <input
                    type="text"
                    placeholder="[Click here to enter maximum algorithm length]"
                    className="depthInput interactable"
                    name="depth"
                    autoComplete="off"
                    value={props.queryState.depth}
                    onChange={props.handleNumberChange}
                />
            </section>


            <section className="movePanel">

                <label className="label">Toggle allowed moveset <FontAwesomeIcon icon={faCircleInfo} className="circleIconScramble fa-sm" color="white" /></label>
                <section className="buttonGrid">
                    {buttonListFaceMoves}
                    {buttonListWideMoves}
                    {buttonListSliceAndRotation}
                </section>

            </section>


            <section>
                <button
                    className="submitButton button interactable"
                    onClick={() => props.handleSubmit(props.queryState)}
                >
                    Show Me Solutions!
                </button>
            </section>


        </div>
    );
}

export default QueryForm;