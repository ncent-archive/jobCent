import App from './App';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export default ({ store }) => (  
        <BrowserRouter>
            <App />
        </BrowserRouter>
);