// imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import QueryForm from './components/QueryForm';
import Solutions from './components/Solutions';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Index() {
    return (
        <div>
            <QueryForm />
            <Solutions />
        </div>
    )
}

root.render(
<Index />
);

