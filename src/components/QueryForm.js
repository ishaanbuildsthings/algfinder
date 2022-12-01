import React from 'react';
import MovesetButton from "./MovesetButton";

function QueryForm(props) {

    // initialize state
    const [queries, setQueries] = React.useState({
        scramble: "",
        moveset: [],
        depth: ""
    });


    // when scramble or depth text fields are changed, changes the state
    function handleTextChange(event) {
        const {name, value} = event.target;
        setQueries({
            ...queries,
            [name]: value
        })
    }

    // when scramble or depth text fields are changed, changes the state
    function handleNumberChange(event) {
        const {name, value} = event.target;
        const result = value.replace(/\D/g, '');
        setQueries({
            ...queries,
            [name]: result
        })
    }

    // when a moveset button is clicked or un-clicked, changes the state
    function handleMovesetClick(id) {
        if (!queries.moveset.includes(id)) {
            setQueries({
                ...queries,
                moveset: [...queries.moveset, id]
            });
        } else {
            setQueries({
                ...queries,
                moveset: queries.moveset.filter((element) => element !== id)
            });
        }
    }

    // creates an entire row of moveset buttons
    function createManyJsxButtons(listOfLetters) {
        const listOfButtons = [];
        for (let letter of listOfLetters) {
            listOfButtons.push(
                <MovesetButton
                               name={letter}
                               value={letter}
                               id={letter}
                               changeMove={handleMovesetClick}
                />
            );
        }
        return listOfButtons;
    }

    const buttonListFaceMoves = createManyJsxButtons(["R", "U", "D", "F", "L", "B"]);
    const buttonListWideMoves = createManyJsxButtons(["r", "u", "d", "f", "l", "b"]);
    const buttonListSliceAndRotation = createManyJsxButtons(["M", "S", "E", "x", "y", "z"]);


    return (
        <section className="queryForm">

            {/* Scramble Text Box */}
            <input
                type="text"
                placeholder="Scramble"
                className="scramble userInteractField"
                name="scramble"
                autoComplete="off"
                value={queries.scramble}
                onChange={handleTextChange}
            />

            {/* Depth Number Box */}
            <input
                type="text"
                placeholder="Depth"
                className="depth userInteractField"
                name="depth"
                autoComplete="off"
                value={queries.depth}
                onChange={handleNumberChange}
            />

        <section className="form--face-buttons">
            {buttonListFaceMoves}
        </section>

        <section className="form--wide-buttons">
            {buttonListWideMoves}
        </section>

        <section>
            {buttonListSliceAndRotation}
        </section>

            <button
                className="submit userInteractField button"
                onClick={() => props.handleSubmit(queries)}
            >
                Show Me Solutions!
            </button>
        </section>
    );
}

export default QueryForm;