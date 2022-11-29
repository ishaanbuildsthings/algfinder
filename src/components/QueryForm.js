import React from 'react';

function QueryForm(props) {

    // initialize state
    const [queries, setQueries] = React.useState({
        scramble: "",
        moveset: "",
        depth: ""
    });


    // changes the object state when text is modified
    function handleChange(event) {
        const {name, value} = event.target;
        setQueries({
            ...queries,
            [name]: value
        })
    }


    // defines component
    return (
        <section className="queryForm">

            <input
                type="text"
                placeholder="Enter Scramble Here"
                className="form--scramble"
                name="scramble"
                value={queries.scramble}
                onChange={handleChange}
            />
            <input
                type="text"
                placeholder="Enter Allowed Moveset Here"
                className="form--moveset"
                name="moveset"
                value={queries.moveset}
                onChange={handleChange}
            />
            <input
                type="text"
                placeholder="Enter Max Algorithm Depth Here"
                className="form--depth"
                name="depth"
                value={queries.depth}
                onChange={handleChange}
            />

            <button
                className="form--button"
                onClick={() => props.handleClick(queries)}
            >
                Solve!
            </button>

        </section>
    );
}

export default QueryForm;