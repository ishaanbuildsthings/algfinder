import React from 'react';
import MovesetButton from "./MovesetButton";

function QueryForm(props) {

    // initialize state
    const [queries, setQueries] = React.useState({
        scramble: "",
        moveset: [],
        depth: ""
    });


    // changes the object state when text is modified
    function handleTextChange(event) {
        const {name, value} = event.target;
        setQueries({
            ...queries,
            [name]: value
        })
    }

    // handles moveset button clicks
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


    // defines component
    return (
        <section className="queryForm">

            <input
                type="text"
                placeholder="Scramble"
                className="form--scramble"
                name="scramble"
                value={queries.scramble}
                onChange={handleTextChange}
            />

        <section className="form--face-buttons">
            <MovesetButton name="R"
                           value="R"
                           id="R"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="U"
                           value="U"
                           id="U"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="F"
                           value="F"
                           id="F"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="D"
                           value="D"
                           id="D"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="L"
                           value="L"
                           id="L"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="B"
                           value="B"
                           id="B"
                           changeMove={handleMovesetClick}
            />
        </section>

        <section className="form--wide-buttons">
            <MovesetButton name="r"
                           value="r"
                           id="r"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="u"
                           value="u"
                           id="u"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="f"
                           value="f"
                           id="f"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="d"
                           value="d"
                           id="d"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="l"
                           value="l"
                           id="l"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="b"
                           value="b"
                           id="b"
                           changeMove={handleMovesetClick}
            />
        </section>

        <section>
            <MovesetButton name="M"
                           value="M"
                           id="M"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="S"
                           value="S"
                           id="S"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="E"
                           value="E"
                           id="E"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="x"
                           value="x"
                           id="x"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="y"
                           value="y"
                           id="y"
                           changeMove={handleMovesetClick}
            />
            <MovesetButton name="z"
                           value="z"
                           id="z"
                           changeMove={handleMovesetClick}
            />
        </section>



            <input
                type="text"
                placeholder="Enter Max Algorithm Depth"
                className="form--depth"
                name="depth"
                value={queries.depth}
                onChange={handleTextChange}
            />

            <button
                className="form--submit"
                onClick={() => props.handleSubmit(queries)}
            >
                Solve!
            </button>
        </section>
    );
}

export default QueryForm;