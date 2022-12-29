import React from 'react';
import MovesetButton from "./MovesetButton.js";
import UseWindowSize from '../../Tools/UseWindowSize.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function QueryForm(props) {
    // custom hook to dynamically re-render on window size changes
  let windowSize = UseWindowSize();

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
                               key={letter} // TODO: why
                               handleMovesetClick={props.handleMovesetClick}
                />
            );
        }
        return listOfButtons;
    }

    const buttonListFaceMoves = createManyJsxButtons(['R', 'U', 'D', 'F', 'L', 'B']);
    const buttonListWideMoves = createManyJsxButtons(['r', 'u', 'd', 'f', 'l', 'b']);
    const buttonListSliceAndRotation = createManyJsxButtons(['M', 'S', 'E', 'x', 'y', 'z']);


    return (
        // * queryFormContainer
        <>
            <section className="scramblePanel">

                <label className="scrambleLabel mainText mainColor" htmlFor="scrambleInput">Scramble
                <div className="iconAndPopup">
                        <FontAwesomeIcon icon={faCircleInfo} className="scrambleIcon icon mainText"/>
                        <div className="scramblePopup popup">
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
                    value={props.scramble}
                    onChange={props.handleTextChange}

                />

            </section>


            <section className="depthPanel">

                <label className="mainText mainColor" htmlFor="depthInput">Max Algorithm Length
                    <div className="iconAndPopup">
                        <FontAwesomeIcon icon={faCircleInfo} className="depthIcon icon mainText"/>
                        <div className="depthPopup popup">
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
                    value={props.depth}
                    onChange={props.handleNumberChange}
                />
            </section>


            <section className="movePanel">

                <label className="mainText mainColor">Toggle allowed moveset
                <div className="iconAndPopup">
                        <FontAwesomeIcon icon={faCircleInfo} className="movesetIcon mainText icon"/>
                        <div className="movesetPopup popup">
                            <p>Enter the move types you want the solutions to be restricted to.</p>
                            <p>Example: if you enter RUD, solutions will at most use those three move types.</p>
                        </div>
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

// TODO: fix js, mobile css, check extra classes, order inside cx