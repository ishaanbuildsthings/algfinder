import React from 'react';
import MovesetButton from "./MovesetButton.js";
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
        // * queryFormContainer
        <>
            <section className="scramblePanel">

                <label className="scrambleLabel mainText mainColor" htmlFor="scrambleInput">Scramble
                <div className="iconAndPopup">
                        <FontAwesomeIcon icon={faCircleInfo} className="scrambleIcon icon mainText fa-sm"/>
                        <span className="scramblePopup popup">Enter the scramble for which you want to find solutions. Moves must be
                        delimited by spaces, for instance: R2 U R' U x R U L'</span>
                    </div>
                </label>

                <input
                    id="scrambleInput"
                    type="text"
                    placeholder="[Click here to enter scramble you want to solve]"
                    className="secondaryColor mainText"
                    name="scramble"
                    autoComplete="off"
                    value={props.scramble}
                    onChange={props.handleTextChange}

                />

            </section>


            <section className="depthPanel">

                <label className="mainText mainColor" htmlFor="depthInput">Max Algorithm Length
                    <div className="iconAndPopup">
                        <FontAwesomeIcon icon={faCircleInfo} className="depthIcon icon mainText fa-sm"/>
                        <span className="depthPopup popup">Enter the maximum algorithm length the solver will use. For example,
                        if you enter 14, the solver will generate all solutions that are 14 moves or shorter.</span>
                    </div>
                </label>


                <input
                    id="depthInput"
                    type="text"
                    placeholder="[Click here to enter maximum algorithm length]"
                    className="secondaryColor mainText"
                    name="depth"
                    autoComplete="off"
                    value={props.depth}
                    onChange={props.handleNumberChange}
                />
            </section>


            <section className="movePanel">

                <label className="mainText mainColor">Toggle allowed moveset
                <div className="iconAndPopup">
                        <FontAwesomeIcon icon={faCircleInfo} className="movesetIcon mainText icon fa-sm"/>
                        <span className="movesetPopup popup">Enter the move types you want the solutions to be restricted to.
                        For example, if you enter RUD, solutions will at most use those three move types.</span>
                    </div>
                </label>
                <section className="buttonGrid">
                    {buttonListFaceMoves}
                    {buttonListWideMoves}
                    {buttonListSliceAndRotation}
                </section>

            </section>



                <button
                    className="submitButton button mainText secondaryColor"
                    onClick={() => props.handleSubmit(props.queriesState)}
                >
                    Show Me Solutions!
                </button>

        </>


    );
}

export default QueryForm;

// TODO: fix js, mobile css, check extra classes, ' vs "", order inside cx