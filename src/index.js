import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import QueryForm from './components/QueryForm';
import SolutionsDisplay from './components/SolutionsDisplay';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Index() {

    const [solutionsList, setSolutionsList] = React.useState([]);

    // converts "R U D' R' F" to "R,U,D',R',F"
    function delimit(str) {
        return str.split(' ').join(',');
    }

    // accepts queries object and triggers async function
    async function handleClick(queries) {
        const {scramble, moveset, depth} = queries;
        const response = await fetch(`http://127.0.0.1:5000/solve?scramble=${delimit(scramble)}&max_depth=${depth}&move_types=${delimit(moveset)}`);
        const data = await response.json();

        // to change
        console.log(data);
        setSolutionsList(data);
    }

    return (
        <div>
            <QueryForm handleClick={handleClick}/>
            <SolutionsDisplay solutionsList={solutionsList}/>
        </div>
    )
}

root.render(
<Index />
);

