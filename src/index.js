import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import QueryForm from './components/QueryForm';
import SolutionsDisplay from './components/SolutionsDisplay';

const root = ReactDOM.createRoot(document.getElementById('root'));
const baseURL = 'http://127.0.0.1:5000';
const pollInterval = 1000; // ms

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

    async function fetchURL(url) {
        // TODO: handle errors
        const response = await fetch(url);
        return await response.json();
    }
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // handles query form submission
    async function handleSubmit(queries) {
        const {scramble, moveset, depth} = queries;
        const txn_id = await fetchURL(`${baseURL}/solve?scramble=${delimit(scramble)}&max-depth=${depth}&move-types=${delimitList(moveset)}`);
        console.log(`got txn_id: ${txn_id}`);

        let solns = []
        do {
            await sleep(pollInterval)
            solns = await fetchURL(`${baseURL}/solve-update?txn-id=${txn_id}`)
            setSolutionsList(prevSolns => [...prevSolns, ...solns]);
            console.log(solns)
        } while(solns[solns.length-1] !== 'DONE')
        setSolutionsList(prevSolns => [...prevSolns, ...solns]);
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

