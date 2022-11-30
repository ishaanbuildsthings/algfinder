import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import QueryForm from './components/QueryForm';
import SolutionsDisplay from './components/SolutionsDisplay';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Index() {

    // state for SolutionsDisplay
    const [solutionsList, setSolutionsList] = React.useState([]);

    // converts "R U D' R' F" to "R,U,D',R',F"
    function delimit(str) {
        return str.split(' ').join(',');
    }

    // converts ["R","x",D"] to "R,x,D"
    function delimitList(list) {
        let str;
        str = list.join(",")
        return str;
    }

    // handles query form submission
    async function handleSubmit(queries) {
        const {scramble, moveset, depth} = queries;
        const response = await fetch(`http://127.0.0.1:5000/solve?scramble=${delimit(scramble)}&max_depth=${depth}&move_types=${delimitList(moveset)}`);
        const data = await response.json();
        setSolutionsList(data);
    }

    return (
        <div>
        <section>
            <QueryForm handleSubmit={handleSubmit}/>
            <SolutionsDisplay solutionsList={solutionsList}/>
        </section>

        </div>
    )
}

root.render(
<Index />
);

